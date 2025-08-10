import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthService } from './authService';

export type User = {
  id: string;
  username: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  avatarUrl?: string | null;
};

const API_URL = 'https://social-media-project-9u8u.onrender.com/graphql/';
const AUTH_SCHEME_CACHE_KEY = 'authScheme';
const SEARCH_CANDIDATE_CACHE_KEY = 'searchUsersCandidate';
const DEBUG_SEARCH = false; // flip to true for verbose logs

// Simple auth errors detector
const isAuthError = (errors: any[] = []) => {
  const msg = (errors[0]?.message || '').toLowerCase();
  return ['login', 'logged in', 'unauthorized', 'authentication', 'expired', 'credentials'].some(k => msg.includes(k));
};

// Build headers for a given scheme
const buildHeaders = async (scheme?: 'Bearer' | 'JWT' | 'Token' | '') => {
  const token = await AuthService.getToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token && scheme) headers['Authorization'] = `${scheme} ${token}`;
  return headers;
};

// Try cached scheme first, then cycle Bearer/JWT/Token, finally no auth
const tryGraphQLWithAuthFallback = async (body: any) => {
  const cached = (await AsyncStorage.getItem(AUTH_SCHEME_CACHE_KEY)) as 'Bearer' | 'JWT' | 'Token' | null;
  const order: Array<'Bearer' | 'JWT' | 'Token' | ''> = cached ? [cached, 'Bearer', 'JWT', 'Token', ''] : ['Bearer', 'JWT', 'Token', ''];

  let last: any;
  for (const scheme of order) {
    try {
      const headers = await buildHeaders(scheme || undefined);
      const res = await fetch(API_URL, { method: 'POST', headers, body: JSON.stringify(body) });
      const text = await res.text();
      let json: any;
      try { json = JSON.parse(text); } catch { json = { parseError: text }; }

      if (!res.ok) {
        last = new Error(`HTTP error! status: ${res.status}`);
        (last as any).body = json;
        if (DEBUG_SEARCH) console.warn('searchUsers HTTP error', res.status, json?.errors || json?.parseError || '');
        continue;
      }

      // If auth error under this scheme, try next
      if (json?.errors && isAuthError(json.errors)) {
        last = new Error('Auth error under scheme ' + (scheme || 'none'));
        (last as any).body = json;
        if (DEBUG_SEARCH) console.warn('searchUsers auth error with scheme', scheme, json.errors);
        continue;
      }

      // Cache working scheme if request succeeded and scheme is set
      if (!json?.errors && scheme) {
        await AsyncStorage.setItem(AUTH_SCHEME_CACHE_KEY, scheme);
      }
      return json;
    } catch (e: any) {
      last = e;
      if (DEBUG_SEARCH) console.warn('searchUsers network/error', e?.message || e);
      continue;
    }
  }
  throw last || new Error('GraphQL request failed');
};

// Tries multiple common query shapes/field names and normalizes to User[]
export const searchUsers = async (q: string): Promise<User[]> => {
  // Skip empty queries
  const query = q.trim();
  if (!query) return [];

  const USER_SELECTION = `
    id
    username
    firstName
    lastName
    email
  `;

  // Candidates: field name + arg signature + result shape
  type Shape = 'list' | 'edges' | 'items' | 'single';
  type Candidate = { field: string; arg: string; shape: Shape };
  const baseCandidates: Candidate[] = [
    // Prefer Graphene-Django style first
    { field: 'allUsers',    arg: '(username_Icontains: $q)', shape: 'list' },
    { field: 'allUsers',    arg: '(username_Istartswith: $q)', shape: 'list' },

    // Common list variants
    { field: 'users',       arg: '(search: $q)', shape: 'list' },
    { field: 'users',       arg: '(username: $q)', shape: 'list' },
    { field: 'getUsers',    arg: '(username: $q)', shape: 'list' },
    { field: 'searchUsers', arg: '(query: $q)', shape: 'list' },

    // Connection-style
    { field: 'allUsers',    arg: '(username_Icontains: $q)', shape: 'edges' },
    { field: 'users',       arg: '(search: $q)', shape: 'edges' },
    { field: 'searchUsers', arg: '(query: $q)', shape: 'edges' },

    // Paged items
    { field: 'allUsers',    arg: '(username_Icontains: $q)', shape: 'items' },
    { field: 'users',       arg: '(search: $q)', shape: 'items' },

    // Filter object styles
    { field: 'users',       arg: '(filter: { username: $q })', shape: 'list' },
    { field: 'users',       arg: '(filter: { username_Icontains: $q })', shape: 'list' },
    { field: 'allUsers',    arg: '(filter: { username_Icontains: $q })', shape: 'list' },

    // Single user by username
    { field: 'user',        arg: '(username: $q)', shape: 'single' },
    { field: 'getUser',     arg: '(username: $q)', shape: 'single' },
    { field: 'userByUsername', arg: '(username: $q)', shape: 'single' },
  ];

  // Try cached candidate first to avoid trying every variant and reduce logs
  let candidates: Candidate[] = [...baseCandidates];
  try {
    const cachedCandRaw = await AsyncStorage.getItem(SEARCH_CANDIDATE_CACHE_KEY);
    if (cachedCandRaw) {
      const cachedCand: Candidate = JSON.parse(cachedCandRaw);
      const exists = candidates.some(c => c.field === cachedCand.field && c.arg === cachedCand.arg && c.shape === cachedCand.shape);
      if (!exists) candidates.unshift(cachedCand); else {
        // Move cached to front
        candidates = [cachedCand, ...candidates.filter(c => !(c.field === cachedCand.field && c.arg === cachedCand.arg && c.shape === cachedCand.shape))];
      }
    }
  } catch {}

  for (const c of candidates) {
    const selection =
      c.shape === 'list'   ? `${c.field}${c.arg} { ${USER_SELECTION} }` :
      c.shape === 'edges'  ? `${c.field}${c.arg} { edges { node { ${USER_SELECTION} } } }` :
      c.shape === 'items'  ? `${c.field}${c.arg} { items { ${USER_SELECTION} } }` :
                             `${c.field}${c.arg} { ${USER_SELECTION} }`;

    const body = {
      query: `query SearchUsers($q: String!) { ${selection} }`,
      variables: { q: query },
    };

    try {
      if (DEBUG_SEARCH) console.log('🔎 Trying users search with:', c.field, c.arg, c.shape);
      const result = await tryGraphQLWithAuthFallback(body);
      if (result?.parseError) {
        if (DEBUG_SEARCH) console.warn('searchUsers parseError with', c.field, String(result.parseError).slice(0, 200));
        continue;
      }
      if (result?.errors) {
        if (DEBUG_SEARCH) console.warn('searchUsers GraphQL errors with', c.field, c.arg, result.errors?.map?.((e: any) => e?.message) || result.errors);
        // If it's not an auth error, just try next candidate
        continue;
      }

      const root = result?.data?.[c.field];
      if (root == null) { 
        if (DEBUG_SEARCH) console.warn('searchUsers no data for', c.field);
        continue; 
      }

      let list: any[] = [];
      if (c.shape === 'single') {
        if (root) list = [root];
      } else if (Array.isArray(root)) {
        list = root;
      } else if (Array.isArray(root?.items)) {
        list = root.items;
      } else if (Array.isArray(root?.edges)) {
        list = root.edges.map((e: any) => e?.node).filter(Boolean);
      }

      if (!list.length) {
        if (DEBUG_SEARCH) console.warn('searchUsers empty list for', c.field, c.shape);
        continue;
      }

      // Cache the working candidate to reduce future attempts/logs
      try { await AsyncStorage.setItem(SEARCH_CANDIDATE_CACHE_KEY, JSON.stringify(c)); } catch {}

      if (DEBUG_SEARCH) console.log('✅ searchUsers using', c.field, c.shape, `(${list.length} results)`);
      return list.map((u: any) => ({
        id: u.id,
        username: u.username,
        firstName: u.firstName ?? null,
        lastName: u.lastName ?? null,
        email: u.email ?? null,
        avatarUrl: u.avatarUrl ?? null,
      }));
    } catch (e: any) {
      if (DEBUG_SEARCH) console.warn('searchUsers candidate failed for', c.field, c.arg, e?.message || e);
      continue;
    }
  }

  if (DEBUG_SEARCH) console.warn('searchUsers: no candidates matched, returning empty list');
  return [];
};