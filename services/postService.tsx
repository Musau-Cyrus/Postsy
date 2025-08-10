import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthService } from './authService';

const API_URL = 'https://social-media-project-9u8u.onrender.com/graphql/';
const AUTH_SCHEME_KEY = 'authScheme';

export interface Post {
    id: string;
    content: string;
    author: {
        id: string;
        username: string;
        firstName?: string;
        lastName?: string;
    };
    createdAt: string;
    likesCount: number;
    commentsCount: number;
}

export interface Comment {
    id: string;
    content: string;
    author: {
        id: string;
        username: string;
        firstName?: string;
        lastName?: string;
    };
    createdAt: string;
}

export const getComments = async (postId: string): Promise<Comment[]> => {
    if (!postId) return [];
    const selection = `{
        id
        content
        createdAt
        user { id username firstName lastName }
        author { id username firstName lastName }
    }`;

    // Direct list fields
    const direct = [
        { field: 'comments', arg: 'postId', varType: 'ID!' },
        { field: 'postComments', arg: 'postId', varType: 'ID!' },
        { field: 'comments', arg: 'id', varType: 'ID!' },
        { field: 'postComments', arg: 'id', varType: 'ID!' },
        { field: 'comments', arg: 'postId', varType: 'String!' },
        { field: 'postComments', arg: 'postId', varType: 'String!' },
        { field: 'comments', arg: 'postId', varType: 'Int!' },
        { field: 'postComments', arg: 'postId', varType: 'Int!' },
    ] as const;

    for (const d of direct) {
        const varDef = `$${d.arg}: ${d.varType}`;
        const query = `
          query GetComments(${varDef}) {
            ${d.field}(${d.arg}: $${d.arg}) ${selection}
          }
        `;
        let value: any = postId;
        if (d.varType === 'Int!') {
            const n = Number(postId);
            value = Number.isFinite(n) ? n : postId;
        }
        try {
            const res = await tryGraphQLWithSchemes({ query, variables: { [d.arg]: value } });
            if (res?.errors) continue;
            const root = res?.data?.[d.field];
            const list = normalizeList(root);
            if (Array.isArray(list)) {
                return list.map((c: any) => {
                    const a = c.user || c.author || {};
                    return {
                        id: String(c.id),
                        content: String(c.content || ''),
                        author: { id: String(a.id || ''), username: String(a.username || ''), firstName: a.firstName, lastName: a.lastName },
                        createdAt: String(c.createdAt || new Date().toISOString()),
                    } as Comment;
                });
            }
        } catch {}
    }

    // Nested under post
    const nested = [
        { arg: 'id', varType: 'ID!' },
        { arg: 'postId', varType: 'ID!' },
        { arg: 'id', varType: 'String!' },
        { arg: 'id', varType: 'Int!' },
    ] as const;
    for (const n of nested) {
        const varDef = `$${n.arg}: ${n.varType}`;
        const query = `
          query GetPostComments(${varDef}) {
            post(${n.arg}: $${n.arg}) { comments ${selection} }
          }
        `;
        let value: any = postId;
        if (n.varType === 'Int!') {
            const num = Number(postId);
            value = Number.isFinite(num) ? num : postId;
        }
        try {
            const res = await tryGraphQLWithSchemes({ query, variables: { [n.arg]: value } });
            if (res?.errors) continue;
            const list = normalizeList(res?.data?.post?.comments);
            if (Array.isArray(list)) {
                return list.map((c: any) => {
                    const a = c.user || c.author || {};
                    return {
                        id: String(c.id),
                        content: String(c.content || ''),
                        author: { id: String(a.id || ''), username: String(a.username || ''), firstName: a.firstName, lastName: a.lastName },
                        createdAt: String(c.createdAt || new Date().toISOString()),
                    } as Comment;
                });
            }
        } catch {}
    }

    return [];
};

export const addComment = async (postId: string, content: string): Promise<Comment | null> => {
    if (!postId || !content?.trim()) return null;
    const selection = `{
        id
        content
        createdAt
        user { id username firstName lastName }
        author { id username firstName lastName }
    }`;

    const mutations = [
        { name: 'addComment', arg: 'postId' },
        { name: 'addCommentToPost', arg: 'postId' },
        { name: 'createComment', arg: 'postId' },
        { name: 'createPostComment', arg: 'postId' },
        { name: 'commentOnPost', arg: 'postId' },
        { name: 'addPostComment', arg: 'postId' },
        { name: 'addComment', arg: 'id' },
        { name: 'createComment', arg: 'id' },
    ] as const;

    const contentArgs = ['content', 'text', 'message', 'body', 'comment'] as const;
    const varTypes = ['ID!', 'String!', 'Int!'] as const;
    let lastErrorMsg: string | null = null;

    // Wrapper with comment field
    for (const m of mutations) {
        for (const t of varTypes) {
            for (const cArg of contentArgs) {
                const varDef = `$${m.arg}: ${t}, $${cArg}: String!`;
                const args = `${m.arg}: $${m.arg}, ${cArg}: $${cArg}`;
                const query = `
                  mutation AddComment(${varDef}) {
                    ${m.name}(${args}) {
                      comment ${selection}
                      ok
                      success
                      message
                    }
                  }
                `;
                let value: any = postId;
                if (t === 'Int!') {
                    const n = Number(postId);
                    value = Number.isFinite(n) ? n : postId;
                }
                try {
                    const res = await tryGraphQLWithSchemes({ query, variables: { [m.arg]: value, [cArg]: content.trim() } });
                    if (res?.errors) { lastErrorMsg = res.errors?.[0]?.message || lastErrorMsg; continue; }
                    const root = res?.data?.[m.name];
                    const node = root?.comment || (root?.id ? root : null);
                    if (node) {
                        const a = node.user || node.author || {};
                        const mapped: Comment = {
                            id: String(node.id),
                            content: String(node.content || ''),
                            author: { id: String(a.id || ''), username: String(a.username || ''), firstName: a.firstName, lastName: a.lastName },
                            createdAt: String(node.createdAt || new Date().toISOString()),
                        };
                        return mapped;
                    }
                    // If we got ok/success only, refetch comments and return latest
                    if (root && (root.ok === true || root.success === true)) {
                        const list = await getComments(String(value));
                        if (list.length) return list[0];
                        return null;
                    }
                } catch (e: any) {
                    lastErrorMsg = e?.message || lastErrorMsg;
                }
            }
        }
    }

    // Object return (no wrapper)
    for (const m of mutations) {
        for (const t of varTypes) {
            for (const cArg of contentArgs) {
                const varDef = `$${m.arg}: ${t}, $${cArg}: String!`;
                const args = `${m.arg}: $${m.arg}, ${cArg}: $${cArg}`;
                const query = `
                  mutation AddComment(${varDef}) {
                    ${m.name}(${args}) ${selection}
                  }
                `;
                let value: any = postId;
                if (t === 'Int!') {
                    const n = Number(postId);
                    value = Number.isFinite(n) ? n : postId;
                }
                try {
                    const res = await tryGraphQLWithSchemes({ query, variables: { [m.arg]: value, [cArg]: content.trim() } });
                    if (res?.errors) { lastErrorMsg = res.errors?.[0]?.message || lastErrorMsg; continue; }
                    const node = res?.data?.[m.name];
                    if (!node) continue;
                    const a = node.user || node.author || {};
                    const mapped: Comment = {
                        id: String(node.id),
                        content: String(node.content || ''),
                        author: { id: String(a.id || ''), username: String(a.username || ''), firstName: a.firstName, lastName: a.lastName },
                        createdAt: String(node.createdAt || new Date().toISOString()),
                    };
                    return mapped;
                } catch (e: any) {
                    lastErrorMsg = e?.message || lastErrorMsg;
                }
            }
        }
    }

    if (lastErrorMsg) throw new Error(lastErrorMsg);
    return null;
};

const isAuthErrorMessage = (msg: string) => {
    const m = (msg || '').toLowerCase();
    return m.includes('logged in') || m.includes('unauthorized') || m.includes('authentication') || m.includes('forbidden') || m.includes('not authenticated');
};

const buildAuthHeader = (token: string, scheme: string) => {
    const trimmed = token.trim();
    if (trimmed.toLowerCase().startsWith(`${scheme.toLowerCase()} `)) return trimmed; // already prefixed
    return `${scheme} ${trimmed}`;
};

const getAuthHeaders = async (scheme?: string) => {
    console.log('🔐 Getting auth headers...');
    const token = await AuthService.getToken();
    if (!token) {
        console.error('❌ No token found in storage');
        throw new Error('You must be logged in to perform this action');
    }
    const savedScheme = scheme || (await AsyncStorage.getItem(AUTH_SCHEME_KEY)) || 'Bearer';
    const authHeader = buildAuthHeader(token, savedScheme);
    console.log('✅ Auth header prepared using scheme:', savedScheme);
    console.log('🔍 Full auth header:', authHeader.substring(0, 50) + '...');
    return {
        'Content-Type': 'application/json',
        'Authorization': authHeader
    } as const;
};

const tryGraphQLWithSchemes = async (body: any) => {
    const token = await AuthService.getToken();
    if (!token) throw new Error('You must be logged in to perform this action');

    const schemes = [
        (await AsyncStorage.getItem(AUTH_SCHEME_KEY)) || 'Bearer',
        'JWT',
        'Token'
    ].filter((v, i, a) => a.indexOf(v) === i);

    let lastError: any = null;

    for (const scheme of schemes) {
        const headers = await getAuthHeaders(scheme);
        const response = await fetch(API_URL, {
            method: 'POST',
            headers,
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            let respBody: any = null;
            try { respBody = await response.json(); } catch { try { respBody = await response.text(); } catch {} }
            const schemaErrMsg = JSON.stringify(respBody || '').toLowerCase();
            // If server responded with GraphQL schema errors (e.g. Cannot query field ...), do not retry schemes and do not log as hard error
            if (
                schemaErrMsg.includes('cannot query field') ||
                schemaErrMsg.includes('unknown argument') ||
                (schemaErrMsg.includes('field') && schemaErrMsg.includes('cannot query'))
            ) {
                return typeof respBody === 'object' && respBody ? respBody : { errors: [{ message: String(respBody) }], data: null };
            }

            // Non-schema HTTP errors: log and try next scheme
            console.error('❌ HTTP error', response.status, respBody);
            lastError = new Error(`HTTP error! status: ${response.status}`);
            continue;
        }

        const result = await response.json();
        if (result?.errors && Array.isArray(result.errors)) {
            const msgs = result.errors.map((e: any) => e?.message || '').join(' | ');
            if (isAuthErrorMessage(msgs)) {
                console.warn(`⚠️ Auth error with scheme ${scheme}. Trying next scheme...`);
                lastError = new Error(msgs);
                continue;
            }
            // Schema or other GraphQL errors: return immediately without retrying different schemes
            return result;
        }

        const saved = await AsyncStorage.getItem(AUTH_SCHEME_KEY);
        if (saved !== scheme) {
            await AsyncStorage.setItem(AUTH_SCHEME_KEY, scheme);
            console.log('💾 Cached auth scheme:', scheme);
        }
        return result;
    }

    throw lastError || new Error('GraphQL request failed');
};

const handleAuthError = async (errors: any[]) => {
    const authError = errors.find((error: any) => 
        (error.message || '').toLowerCase().includes('logged in') || 
        (error.message || '').toLowerCase().includes('unauthorized') ||
        (error.message || '').toLowerCase().includes('authentication') ||
        (error.message || '').toLowerCase().includes('expired')
    );
    
    if (authError) {
        console.log('🔴 Authentication error detected.', authError?.message);
        const msg = (authError?.message || '').toLowerCase();
        // Only clear token on explicit expiry indicators from the backend
        if (msg.includes('expired') || msg.includes('token expired') || msg.includes('signature has expired')) {
            console.log('🗑️ Clearing expired token');
            await AuthService.clearToken();
        } else {
            console.log('⚠️ Auth error but token not cleared (no explicit expiry).');
        }
        throw new Error('Authentication failed. Please check your login status.');
    }
};

// Helper: normalize list or connection to array of nodes
const normalizeList = (root: any): any[] => {
    if (Array.isArray(root)) return root;
    if (Array.isArray(root?.items)) return root.items;
    if (Array.isArray(root?.edges)) return root.edges.map((e: any) => e?.node).filter(Boolean);
    return [];
};

// Helper: fetch all pages for a connection-style feed if supported
const fetchAllFeedPages = async (pageSize = 25): Promise<Post[] | null> => {
    const query = `
      query FeedPaged($first: Int, $after: String) {
        feed(first: $first, after: $after) {
          edges {
            node {
              id
              content
              createdAt
              user { id username firstName lastName }
              likesCount
              commentsCount
            }
          }
          pageInfo { hasNextPage endCursor }
        }
      }
    `;

    let after: string | null = null;
    const seen = new Map<string, Post>();
    for (let i = 0; i < 20; i++) { // safety cap
        const result = await tryGraphQLWithSchemes({ query, variables: { first: pageSize, after } });
        if (result?.errors) return null; // connection with args not supported; abort
        const root = result?.data?.feed;
        if (!root) break;
        const page = Array.isArray(root?.edges) ? root.edges.map((e: any) => e?.node).filter(Boolean) : [];
        for (const p of page) {
            const a = p?.user || p?.author || {};
            if (p?.id && !seen.has(p.id)) {
                seen.set(p.id, {
                    id: p.id,
                    content: p.content,
                    author: { id: a.id, username: a.username, firstName: a.firstName, lastName: a.lastName },
                    createdAt: p.createdAt,
                    likesCount: p.likesCount || 0,
                    commentsCount: p.commentsCount || 0,
                });
            }
        }
        const hasNext = !!root?.pageInfo?.hasNextPage;
        after = root?.pageInfo?.endCursor ?? null;
        if (!hasNext || !after) break;
    }
    return seen.size ? Array.from(seen.values()).sort((x, y) => new Date(y.createdAt).getTime() - new Date(x.createdAt).getTime()) : [];
};

const fetchAllUserPostsPages = async (username: string, pageSize = 25): Promise<Post[] | null> => {
    const query = `
      query UserPostsPaged($username: String!, $first: Int, $after: String) {
        userPosts(username: $username, first: $first, after: $after) {
          edges {
            node {
              id
              content
              createdAt
              user { id username firstName lastName }
              author { id username firstName lastName }
              likesCount
              commentsCount
            }
          }
          pageInfo { hasNextPage endCursor }
        }
      }
    `;

    let after: string | null = null;
    const seen = new Map<string, Post>();
    for (let i = 0; i < 20; i++) {
        const result = await tryGraphQLWithSchemes({ query, variables: { username, first: pageSize, after } });
        if (result?.errors) return null; // args not supported; abort
        const root = result?.data?.userPosts;
        if (!root) break;
        const page = Array.isArray(root?.edges) ? root.edges.map((e: any) => e?.node).filter(Boolean) : [];
        for (const p of page) {
            const a = p?.user || p?.author || {};
            if (p?.id && !seen.has(p.id)) {
                seen.set(p.id, {
                    id: p.id,
                    content: p.content,
                    author: { id: a.id, username: a.username, firstName: a.firstName, lastName: a.lastName },
                    createdAt: p.createdAt,
                    likesCount: p.likesCount || 0,
                    commentsCount: p.commentsCount || 0,
                });
            }
        }
        const hasNext = !!root?.pageInfo?.hasNextPage;
        after = root?.pageInfo?.endCursor ?? null;
        if (!hasNext || !after) break;
    }
    return seen.size ? Array.from(seen.values()).sort((x, y) => new Date(y.createdAt).getTime() - new Date(x.createdAt).getTime()) : [];
};

// Load a list of users (id, username) from allUsers and normalize shapes
const getAllUserBasics = async (): Promise<Array<{ id: string; username: string }>> => {
    const field = 'allUsers';
    const shapes: Array<'list' | 'items' | 'edges'> = ['list', 'items', 'edges'];
    for (const shape of shapes) {
        const selection =
            shape === 'list'
                ? `${field} { id username }`
                : shape === 'items'
                    ? `${field} { items { id username } }`
                    : `${field} { edges { node { id username } } }`;
        const query = `query { ${selection} }`;
        try {
            const result = await tryGraphQLWithSchemes({ query });
            if (result?.errors) continue;
            const root = result?.data?.[field];
            const list = Array.isArray(root)
                ? root
                : Array.isArray(root?.items)
                    ? root.items
                    : Array.isArray(root?.edges)
                        ? root.edges.map((e: any) => e?.node).filter(Boolean)
                        : [];
            if (list.length) {
                return list
                    .map((u: any) => ({ id: String(u?.id), username: String(u?.username || '') }))
                    .filter((u: { id: string; username: string }) => !!u.username);
            }
        } catch {}
    }
    return [];
};

// Aggregate posts from other users (excluding current user)
const getOtherUsersPosts = async (maxUsers = 20): Promise<Post[]> => {
    try {
        const meRaw = await AsyncStorage.getItem('userData');
        const me = meRaw ? JSON.parse(meRaw) : null;
        const myUsername: string | undefined = me?.username;

        const users = await getAllUserBasics();
        const others = users.filter(u => (myUsername ? u.username !== myUsername : true)).slice(0, maxUsers);
        if (!others.length) return [];

        const results: Post[][] = [];
        // Limit concurrency to avoid spamming the API
        const batchSize = 5;
        for (let i = 0; i < others.length; i += batchSize) {
            const batch = others.slice(i, i + batchSize);
            const postsBatch = await Promise.all(batch.map(u => getUserPosts(u.username)));
            for (const arr of postsBatch) {
                results.push(arr || []);
            }
        }

        const merged = results.flat();
        // De-duplicate by id
        const map = new Map<string, Post>();
        for (const p of merged) map.set(p.id, p);
        return Array.from(map.values()).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch {
        return [];
    }
};

export async function getUserPosts(username: string): Promise<Post[]> {
    if (!username?.trim()) return [];

    try {
        const query = `
            query UserPosts($username: String!) {
                userPosts(username: $username) {
                    id
                    content
                    createdAt
                    user { id username firstName lastName }
                    author { id username firstName lastName }
                    likesCount
                }
            }
        `;
        const result = await tryGraphQLWithSchemes({ query, variables: { username } });
        if (result?.errors) return [];
        const normalized = normalizeList(result?.data?.userPosts);
        const mapped: Post[] = normalized.map((p: any) => {
            const a = p.user || p.author || {};
            return {
                id: p.id,
                content: p.content,
                author: {
                    id: a.id,
                    username: a.username,
                    firstName: a.firstName,
                    lastName: a.lastName,
                },
                createdAt: p.createdAt,
                likesCount: p.likesCount || 0,
                commentsCount: p.commentsCount || 0,
            };
        });
        return mapped.sort((x, y) => new Date(y.createdAt).getTime() - new Date(x.createdAt).getTime());
    } catch {
        return [];
    }
}

export const createPost = async (content: string): Promise<Post | null> => {
    try {
        console.log('=== CREATE POST DEBUG ===');
        console.log('📝 Content:', content);

        const body = {
            query: `
                mutation CreatePost($content: String!){
                    createPost(content: $content){
                        post {
                            id
                            content
                            user {
                                id
                                username
                                firstName
                                lastName
                            }
                            createdAt
                            likesCount
                        }
                    }
                }
            `,
            variables: { content }
        };

        const result = await tryGraphQLWithSchemes(body);
        console.log('📦 Response:', result);

        if (result.errors) {
            console.error('GraphQL errors:', result.errors);
            await handleAuthError(result.errors);
            throw new Error(result.errors[0]?.message || 'Failed to create post');
        }

        const postData = result.data?.createPost?.post;
        if (postData) {
            console.log('✅ Post created successfully');
            return {
                id: postData.id,
                content: postData.content,
                author: {
                    id: postData.user.id,
                    username: postData.user.username,
                    firstName: postData.user.firstName,
                    lastName: postData.user.lastName,
                },
                createdAt: postData.createdAt,
                likesCount: postData.likesCount || 0,
                commentsCount: 0 
            };
        }
        
        throw new Error('No post data returned');
    } catch (error) {
        console.error("Error creating post!", error);
        throw error; 
    }
};

// Update an existing post's content
export const updatePost = async (id: string, content: string): Promise<Post | null> => {
    // Per request: use mutation editPost of type EditPost. We'll try common arg naming variants
    // while keeping the mutation name fixed to `editPost`.
    const selection = `{
        id
        content
        createdAt
        user { id username firstName lastName }
        author { id username firstName lastName }
        likesCount
        commentsCount
    }`;

    const variants = [
        { args: '(id: $id, content: $content)', respPaths: ['post', 'updatedPost', null] },
        { args: '(postId: $id, content: $content)', respPaths: ['post', 'updatedPost', null] },
    ] as const;

    for (const v of variants) {
        const query = `
          mutation EditPost($id: ID!, $content: String!) {
            editPost${v.args} {
              ${v.respPaths[0] ? `${v.respPaths[0]} ${selection}` : selection}
            }
          }
        `;
        try {
            const result = await tryGraphQLWithSchemes({ query, variables: { id, content } });
            if (result?.errors) continue;
            const root = result?.data?.editPost;
            const node = v.respPaths[0] && root?.[v.respPaths[0]] ? root[v.respPaths[0]] : (root?.id ? root : null);
            if (!node) continue;
            const a = node.user || node.author || {};
            const mapped: Post = {
                id: node.id,
                content: node.content,
                author: {
                    id: a.id,
                    username: a.username,
                    firstName: a.firstName,
                    lastName: a.lastName,
                },
                createdAt: node.createdAt,
                likesCount: node.likesCount || 0,
                commentsCount: node.commentsCount || 0,
            };
            return mapped;
        } catch {}
    }
    return null;
};

// Delete a post by id
export const deletePost = async (id: string): Promise<boolean> => {
    if (!id) return false;
    id = String(id).trim();

    // Try safe variants of the same mutation: deletePost of type DeletePost (or boolean),
    // with common arg names (id | postId | postID) and return shapes. Also try ID/String/Int types.
    const candidates = [
        // Object returns (common fields)
        { varName: 'id', varType: 'ID!', selection: '{ ok success id }' },
        { varName: 'postId', varType: 'ID!', selection: '{ ok success id }' },
        { varName: 'postID', varType: 'ID!', selection: '{ ok success id }' },
        { varName: 'id', varType: 'String!', selection: '{ ok success id }' },
        { varName: 'postId', varType: 'String!', selection: '{ ok success id }' },
        { varName: 'id', varType: 'Int!', selection: '{ ok success id }' },
        { varName: 'postId', varType: 'Int!', selection: '{ ok success id }' },
        { varName: 'postID', varType: 'Int!', selection: '{ ok success id }' },
        // Minimal object return (__typename only) to avoid schema field errors
        { varName: 'id', varType: 'ID!', selection: '{ __typename }' },
        { varName: 'postId', varType: 'ID!', selection: '{ __typename }' },
        { varName: 'postID', varType: 'ID!', selection: '{ __typename }' },
        // Boolean returns
        { varName: 'id', varType: 'ID!', selection: '' },
        { varName: 'postId', varType: 'ID!', selection: '' },
        { varName: 'id', varType: 'Int!', selection: '' },
        { varName: 'postId', varType: 'Int!', selection: '' },
    ] as const;

    for (const c of candidates) {
        const varDef = `$${c.varName}: ${c.varType}`;
        const arg = `${c.varName}: $${c.varName}`;
        const query = c.selection
            ? `\n      mutation DeletePost(${varDef}) {\n        deletePost(${arg}) ${c.selection}\n      }\n    `
            : `\n      mutation DeletePost(${varDef}) {\n        deletePost(${arg})\n      }\n    `;

        // Coerce value for Int! variants if the id is numeric-like
        let value: any = id;
        if (c.varType === 'Int!') {
            const n = Number(id);
            value = Number.isFinite(n) ? n : id; // fall back to string if not numeric
        }
        const variables: Record<string, any> = { [c.varName]: value };
        try {
            const res = await tryGraphQLWithSchemes({ query, variables });
            if (res?.errors) {
                try { await handleAuthError(res.errors); } catch {}
                continue; // try next candidate on schema or other errors
            }
            const r = res?.data?.deletePost;
            if (typeof r === 'boolean') return r === true;
            if (r && typeof r === 'object') {
                if (r.ok === true || r.success === true) return true;
                if (r.id) return true;
                if (r.deleted === true) return true;
                if (r.status && String(r.status).toLowerCase() === 'success') return true;
                if (typeof r.__typename === 'string') return true; // object returned, treat as success
                if (typeof r.message === 'string' && /deleted|success/i.test(r.message)) return true;
            }
            // If no explicit success signal, try next variant
        } catch {
            // Ignore and try next variant
        }
    }

    return false;
};

// Combine: feed + current user's posts + other users' posts, de-duplicated and sorted
export const getPosts = async (): Promise<Post[]> => {
    const collected: Post[] = [];

    // 1) Feed (simple list)
    try {
        const query = `
            query FetchFeed {
                feed {
                    id
                    content
                    createdAt
                    user { id username firstName lastName }
                    likesCount
                    commentsCount
                }
            }
        `;
        const result = await tryGraphQLWithSchemes({ query });
        if (!result?.errors) {
            const list = normalizeList(result?.data?.feed);
            if (Array.isArray(list) && list.length) {
                const mapped: Post[] = list.map((post: any) => ({
                    id: post.id,
                    content: post.content,
                    author: {
                        id: post.user?.id,
                        username: post.user?.username,
                        firstName: post.user?.firstName,
                        lastName: post.user?.lastName,
                    },
                    createdAt: post.createdAt,
                    likesCount: (post as any).likesCount || 0,
                    commentsCount: (post as any).commentsCount || 0,
                }));
                collected.push(...mapped);
            }
        } else {
            try { await handleAuthError(result.errors); } catch {}
        }
    } catch (e) {
        console.warn('⚠️ Fetch feed failed:', e);
    }

    // 2) Current user's posts (simple list)
    try {
        const raw = await AsyncStorage.getItem('userData');
        const me = raw ? JSON.parse(raw) : null;
        const username: string | undefined = me?.username;
        if (username) {
            const query = `
                query UserPosts($username: String!) {
                    userPosts(username: $username) {
                        id
                        content
                        createdAt
                        user { id username firstName lastName }
                        author { id username firstName lastName }
                        likesCount
                        commentsCount
                    }
                }
            `;
            const result = await tryGraphQLWithSchemes({ query, variables: { username } });
            if (!result?.errors) {
                const list = normalizeList(result?.data?.userPosts);
                const mapped: Post[] = list.map((p: any) => {
                    const a = p.user || p.author || {};
                    return {
                        id: p.id,
                        content: p.content,
                        author: {
                            id: a.id,
                            username: a.username,
                            firstName: a.firstName,
                            lastName: a.lastName,
                        },
                        createdAt: p.createdAt,
                        likesCount: p.likesCount || 0,
                        commentsCount: p.commentsCount || 0,
                    } as Post;
                });
                collected.push(...mapped);
            }
        }
    } catch (e) {
        console.warn('⚠️ Fetch current user posts failed:', e);
    }

    // 3) Other users' posts (fetch via allUsers + userPosts)
    try {
        const others = await getOtherUsersPosts(9999);
        if (Array.isArray(others) && others.length) collected.push(...others);
    } catch (e) {
        console.warn('⚠️ Fetch other users posts failed:', e);
    }

    // De-duplicate by id and sort by createdAt desc
    const map = new Map<string, Post>();
    for (const p of collected) {
        if (p?.id) map.set(p.id, p);
    }
    const combined = Array.from(map.values());
    combined.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return combined;
};

export const checkAuthStatus = async (): Promise<boolean> => {
    try {
        const token = await AuthService.getToken();
        return token !== null;
    } catch {
        return false;
    }
};

export const testAuthWithSimpleQuery = async () => {
    try {
        const headers = await getAuthHeaders();
        const response = await fetch(API_URL, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                query: `
                    query { me { id username } }
                `
            }),
        });
        const result = await response.json();
        return result;
    } catch (error) {
        return null;
    }
};

export { tryGraphQLWithSchemes as graphqlRequest };
