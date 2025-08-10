import AsyncStorage from '@react-native-async-storage/async-storage';
import { graphqlRequest } from './postService';

export type SuggestedUser = {
  id: string;
  username: string;
  firstName?: string | null;
  lastName?: string | null;
  avatarUrl?: string | null;
};

const USER_SELECTION = `
  id
  username
  firstName
  lastName
`;

export const getSuggestedUsers = async (limit = 10): Promise<SuggestedUser[]> => {
  const raw = await AsyncStorage.getItem('userData');
  const me = raw ? JSON.parse(raw) : null;
  const myUsername: string | undefined = me?.username;

  // Per your API: use only allUsers
  const field = 'allUsers' as const;
  const shapes = ['list', 'edges', 'items'] as const;

  for (const shape of shapes) {
    const selection =
      shape === 'list'
        ? `${field} { ${USER_SELECTION} }`
        : shape === 'edges'
          ? `${field} { edges { node { ${USER_SELECTION} } } }`
          : `${field} { items { ${USER_SELECTION} } }`;

    const query = `
      query GetUsers {
        ${selection}
      }
    `;

    try {
      const result = await graphqlRequest({ query });
      if (result?.errors) continue;

      const root = result?.data?.[field];
      let list: any[] = [];
      if (Array.isArray(root)) list = root;
      else if (Array.isArray(root?.items)) list = root.items;
      else if (Array.isArray(root?.edges)) list = root.edges.map((e: any) => e?.node).filter(Boolean);

      if (!list.length) continue;

      const users: SuggestedUser[] = list
        .map((u: any) => ({
          id: u.id,
          username: u.username,
          firstName: u.firstName ?? null,
          lastName: u.lastName ?? null,
          avatarUrl: u.avatarUrl ?? null,
        }))
        .filter(u => (myUsername ? u.username !== myUsername : true));

      return users.slice(0, limit);
    } catch {
      continue; // try next shape
    }
  }

  return [];
};

export const followUser = async (username: string): Promise<boolean> => {
  // Use explicit followUser mutation as requested
  const query = `
    mutation followUser($username: String!) {
      followUser(username: $username) {
        ok
        success
        user { id }
      }
    }
  `;

  try {
    const result = await graphqlRequest({ query, variables: { username } });
    if (result?.errors) return false;

    const r = result?.data?.followUser;
    // Consider boolean, ok/success flags, or presence of user as success
    if (typeof r === 'boolean') return r === true;
    if (!r) return false;
    if (r?.ok === true || r?.success === true) return true;
    if (r?.user) return true;
    return false;
  } catch {
    return false;
  }
};

export const unfollowUser = async (username: string): Promise<boolean> => {
  const query = `
    mutation unfollowUser($username: String!) {
      unfollowUser(username: $username) {
        ok
        success
        user { id }
      }
    }
  `;

  try {
    const result = await graphqlRequest({ query, variables: { username } });
    if (result?.errors) return false;

    const r = result?.data?.unfollowUser;
    if (typeof r === 'boolean') return r === true;
    if (!r) return false;
    if (r?.ok === true || r?.success === true) return true;
    if (r?.user) return true;
    return false;
  } catch {
    return false;
  }
};

export const updateLocalFollowStats = async (
  currentUserId: string,
  targetUserId: string,
  op: 'follow' | 'unfollow'
): Promise<void> => {
  const delta = op === 'follow' ? 1 : -1;
  try {
    // Update current user's following count in profileStats
    const currKey = `profileStats:${currentUserId}`;
    const currRaw = await AsyncStorage.getItem(currKey);
    const curr = currRaw ? JSON.parse(currRaw) : {};
    const updatedCurr = {
      posts: typeof curr.posts === 'number' ? curr.posts : 0,
      followers: typeof curr.followers === 'number' ? curr.followers : 0,
      following: Math.max(0, (typeof curr.following === 'number' ? curr.following : 0) + delta),
    };
    await AsyncStorage.setItem(currKey, JSON.stringify(updatedCurr));

    // Update target user's followers count in profileStats
    const tgtKey = `profileStats:${targetUserId}`;
    const tgtRaw = await AsyncStorage.getItem(tgtKey);
    const tgt = tgtRaw ? JSON.parse(tgtRaw) : {};
    const updatedTgt = {
      posts: typeof tgt.posts === 'number' ? tgt.posts : 0,
      followers: Math.max(0, (typeof tgt.followers === 'number' ? tgt.followers : 0) + delta),
      following: typeof tgt.following === 'number' ? tgt.following : 0,
    };
    await AsyncStorage.setItem(tgtKey, JSON.stringify(updatedTgt));
  } catch {}
};
