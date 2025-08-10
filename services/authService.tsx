import AsyncStorage from "@react-native-async-storage/async-storage";

export class AuthService {
    private static TOKEN_KEY = 'authToken';
    private static LEGACY_TOKEN_KEY = 'userToken'; // for migration
    private static USER_KEY = 'userData';

    // Normalize token by stripping any "Bearer " prefix and trimming
    private static normalizeToken(token: string): string {
        const trimmed = token.trim();
        return trimmed.startsWith('Bearer ') ? trimmed.slice(7).trim() : trimmed;
    }

    // If a legacy token exists under old key, migrate it to the new key
    private static async migrateLegacyToken(): Promise<string | null> {
        try {
            const legacy = await AsyncStorage.getItem(this.LEGACY_TOKEN_KEY);
            if (legacy) {
                const normalized = this.normalizeToken(legacy);
                console.log('🔁 Migrating legacy token from userToken -> authToken');
                await AsyncStorage.setItem(this.TOKEN_KEY, normalized);
                await AsyncStorage.removeItem(this.LEGACY_TOKEN_KEY);
                return normalized;
            }
            return null;
        } catch (e) {
            console.error('❌ Error migrating legacy token:', e);
            return null;
        }
    }

    static async storeToken(token: string): Promise<void> {
        try {
            const normalized = this.normalizeToken(token);
            console.log('📝 Storing token:', normalized.substring(0, 20) + '...');
            await AsyncStorage.setItem(this.TOKEN_KEY, normalized);
            // Clean up any legacy key to avoid confusion
            await AsyncStorage.removeItem(this.LEGACY_TOKEN_KEY);
            console.log('✅ Token stored successfully');
        } catch (error) {
            console.error('❌ Error storing token:', error);
            throw error;
        }
    }
    
    static async getToken(): Promise<string | null> {
        try {
            console.log('🔍 AuthService.getToken() called');
            // First try the current key
            let token = await AsyncStorage.getItem(this.TOKEN_KEY);
            if (!token) {
                console.log('🔍 authToken not found, checking legacy key...');
                // Attempt migration from legacy key
                token = await this.migrateLegacyToken();
            }
            console.log('🔍 Token from storage:', token ? `Found (${token.length} chars)` : 'Not found');
            return token;
        } catch (error) {
            console.error('🔍 Error getting token:', error);
            return null;
        }
    }

    static async clearToken(): Promise<void> {
        try {
            console.log('🗑️ Clearing token');
            await AsyncStorage.multiRemove([this.TOKEN_KEY, this.LEGACY_TOKEN_KEY, this.USER_KEY]);
            console.log('✅ Token cleared successfully');
        } catch (error) {
            console.error('❌ Error clearing token:', error);
        }
    }
    
    static async isAuthenticated(): Promise<boolean> {
        const token = await this.getToken();
        return token !== null;
    }

    static async debugStorage(): Promise<void> {
        try {
            const keys = await AsyncStorage.getAllKeys();
            console.log('🔍 All storage keys:', keys);
            for (const key of keys) {
                const value = await AsyncStorage.getItem(key);
                console.log(`📦 ${key}:`, value?.substring(0, 50) + (value && value.length > 50 ? '...' : ''));
            }
        } catch (error) {
            console.error('❌ Error debugging storage:', error);
        }
    }

    static async handleLoginSuccess(result: any): Promise<void> {
        // Try common token field names from backends
        const token: string | undefined =
            result?.data?.login?.access ??
            result?.data?.login?.token ??
            result?.data?.login?.jwt ??
            result?.data?.loginUser?.token ??
            result?.token ??
            result?.accessToken ??
            result?.access;

        if (!token) {
            console.error('❌ Could not find token in login response:', JSON.stringify(result)?.slice(0, 300));
            throw new Error('Login succeeded but no token was returned by the server.');
        }

        await AuthService.storeToken(token);

        // Optionally persist user payload if present
        const user =
            result?.data?.login?.user ??
            result?.data?.loginUser?.user ??
            result?.data?.me ??
            result?.user ??
            null;
        if (user) {
            try {
                await AsyncStorage.setItem(this.USER_KEY, JSON.stringify(user));
            } catch (e) {
                console.warn('Could not store user data:', e);
            }
        }
    }

    // Quick sanity check to see if token works against your backend
    static async validateTokenAgainstAPI(apiUrl: string): Promise<boolean> {
        try {
            const token = await this.getToken();
            if (!token) return false;
            const res = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    query: `query { me { id username } }`,
                }),
            });
            const json = await res.json();
            return !json?.errors;
        } catch {
            return false;
        }
    }
}