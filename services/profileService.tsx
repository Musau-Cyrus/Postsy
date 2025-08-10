import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthService } from './authService';

const API_URL = 'https://social-media-project-9u8u.onrender.com/graphql/';
const AUTH_SCHEME_KEY = 'authScheme';

// Best-effort content type from filename
const guessContentType = (uri: string) => {
  const lower = uri.toLowerCase();
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.webp')) return 'image/webp';
  if (lower.endsWith('.gif')) return 'image/gif';
  return 'image/jpeg';
};

// Try common mutation names that accept Upload type
const UPLOAD_MUTATIONS = [
  { field: 'updateUserAvatar', var: 'file', selection: 'user { id username }' },
  { field: 'setAvatar', var: 'file', selection: 'user { id username }' },
  { field: 'updateProfilePicture', var: 'file', selection: 'user { id username }' },
  { field: 'updateUserProfileAvatar', var: 'file', selection: 'user { id username }' },
];

export async function uploadAvatar(imageUri: string): Promise<string | null> {
  const token = await AuthService.getToken();
  if (!token) throw new Error('Not authenticated');
  const scheme = (await AsyncStorage.getItem(AUTH_SCHEME_KEY)) || 'Bearer';

  const name = 'avatar' + (imageUri.split('.').pop() ? `.${imageUri.split('.').pop()}` : '.jpg');
  const type = guessContentType(imageUri);

  // React Native FormData file object
  const file: any = { uri: imageUri, name, type };

  // Try each mutation in order
  for (const m of UPLOAD_MUTATIONS) {
    try {
      const operations = JSON.stringify({
        query: `mutation($${m.var}: Upload!) { ${m.field}(${m.var}: $${m.var}) { ${m.selection} } }`,
        variables: { [m.var]: null },
      });
      const map = JSON.stringify({ '0': [`variables.${m.var}`] });

      const form = new FormData();
      form.append('operations', operations as any);
      form.append('map', map as any);
      form.append('0', file);

      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          Authorization: `${scheme} ${token}`,
          // NOTE: Do not set Content-Type; RN will set proper multipart boundary
        } as any,
        body: form as any,
      });

      const json = await res.json();
      if (!res.ok || json?.errors) {
        // Try next mutation on GraphQL or HTTP error
        continue;
      }

      // Extract avatar URL if present under common paths
      const root = json?.data?.[m.field];
      const user = root?.user ?? root?.me ?? root ?? null;
      const url = user?.avatarUrl ?? user?.avatar ?? user?.photoUrl ?? null;
      return url ?? null;
    } catch (e) {
      // Try next mutation
      continue;
    }
  }

  // All attempts failed
  return null;
}

const esc = (s?: string | null) =>
  (s ?? '')
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n');

// Backend errors show UserType doesn't have avatarUrl or bio
const SELECTION = `id username email firstName lastName`;

const has = (v?: string | null) => typeof v === 'string' && v.trim().length > 0;

// Only include firstName/lastName to match server args
const buildArgList = (f?: string, l?: string) =>
  [has(f) ? `firstName: "${esc(f)}"` : '', has(l) ? `lastName: "${esc(l)}"` : '']
    .filter(Boolean)
    .join(', ');

const buildInputObject = (f?: string, l?: string) =>
  `{ ${buildArgList(f, l)} }`;

export async function updateProfile(fields: { firstName?: string; lastName?: string; bio?: string; }): Promise<any | null> {
  const token = await AuthService.getToken();
  if (!token) throw new Error('Not authenticated');
  const scheme = (await AsyncStorage.getItem(AUTH_SCHEME_KEY)) || 'Bearer';

  const f = fields.firstName;
  const l = fields.lastName;
  const args = buildArgList(f, l);
  const input = buildInputObject(f, l);

  if (!args) {
    return null;
  }

  const candidates: string[] = [
    // Preferred name as requested
    `mutation { UpdateProfile(${args}) { profile { ${SELECTION} } } }`,
    `mutation { UpdateProfile(${args}) { user { ${SELECTION} } } }`,

    // Fallbacks (legacy names)
    `mutation { updateProfile(${args}) { profile { ${SELECTION} } } }`,
    `mutation { updateProfile(${args}) { user { ${SELECTION} } } }`,

    // Input-style fallbacks
    `mutation { UpdateProfile(input: ${input}) { profile { ${SELECTION} } } }`,
    `mutation { UpdateProfile(input: ${input}) { user { ${SELECTION} } } }`,
    `mutation { updateProfile(input: ${input}) { profile { ${SELECTION} } } }`,
    `mutation { updateProfile(input: ${input}) { user { ${SELECTION} } } }`,
  ];

  let lastError: any = null;
  for (const query of candidates) {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${scheme} ${token}`,
        },
        body: JSON.stringify({ query }),
      });
      const text = await res.text();
      let json: any;
      try { json = JSON.parse(text); } catch { json = { parseError: text }; }

      if (!res.ok) {
        console.warn('updateProfile HTTP error', res.status, json?.errors || json?.parseError || '');
        lastError = new Error(`HTTP ${res.status}`);
        continue;
      }
      if (json?.errors) {
        console.warn('updateProfile GraphQL errors for candidate:', query.slice(0, 100) + '...', json.errors?.map?.((e: any) => e?.message) || json.errors);
        lastError = new Error('GraphQL error');
        continue;
      }
      if (json?.parseError) {
        console.warn('updateProfile parse error for candidate:', query.slice(0, 100) + '...');
        lastError = new Error('Parse error');
        continue;
      }

      const data = json?.data || {};
      const rootKey = Object.keys(data)[0];
      const root = data[rootKey];
      const user = root?.profile ?? root?.user ?? root?.me ?? root ?? null;
      if (user && typeof user === 'object') return user;
    } catch (e: any) {
      lastError = e;
      console.warn('updateProfile candidate failed:', e?.message || e);
      continue;
    }
  }

  console.warn('updateProfile: All candidates failed.', lastError?.message || lastError || '');
  return null;
}
