import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthService } from './authService';

const API_URL = 'https://social-media-project-9u8u.onrender.com/graphql/';

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

const getAuthHeaders = async () => {
    console.log('🔐 Getting auth headers...');
    
    const token = await AuthService.getToken();
    
    if (!token) {
        console.error('❌ No token found in storage');
        throw new Error('You must be logged in to perform this action');
    }
    
    const authHeader = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    console.log('✅ Auth header prepared');
    console.log('🔍 Full auth header:', authHeader.substring(0, 50) + '...');
    
    // Check if token is expired before using it
    try {
        const tokenParts = token.split('.');
        if (tokenParts.length === 3) {
            const payload = JSON.parse(atob(tokenParts[1]));
            const isExpired = Date.now() > payload.exp * 1000;
            console.log('🔍 Token payload:', payload);
            console.log('🔍 Token expired?', isExpired);
            
            if (isExpired) {
                console.log('⚠️ Token is expired, clearing...');
                await AuthService.clearToken();
                throw new Error('Token expired. Please log in again.');
            }
        }
    } catch (e) {
        console.log('❌ Could not decode token payload, assuming valid');
    }
    
    return {
        'Content-Type': 'application/json',
        'Authorization': authHeader
    };
};

const handleAuthError = async (errors: any[]) => {
    const authError = errors.find((error: any) => 
        error.message.toLowerCase().includes('logged in') || 
        error.message.toLowerCase().includes('unauthorized') ||
        error.message.toLowerCase().includes('authentication')
    );
    
    if (authError) {
        console.log('🔴 Authentication error detected.');
        // Only clear token if we're sure it's invalid
        const token = await AuthService.getToken();
        if (token) {
            try {
                const tokenParts = token.split('.');
                if (tokenParts.length === 3) {
                    const payload = JSON.parse(atob(tokenParts[1]));
                    const isExpired = Date.now() > payload.exp * 1000;
                    if (isExpired) {
                        console.log('🗑️ Clearing expired token');
                        await AuthService.clearToken();
                    }
                }
            } catch (e) {
                // If we can't decode the token, it might be malformed
                console.log('🗑️ Clearing malformed token');
                await AuthService.clearToken();
            }
        }
        throw new Error('Authentication failed. Please check your login status.');
    }
};

export const createPost = async (content: string): Promise<Post | null> => {
    try {
        console.log('=== CREATE POST DEBUG ===');
        console.log('📝 Content:', content);
        
        const headers = await getAuthHeaders();
        
        const requestBody = {
            query: `
                mutation CreatePost($content: String!){
                    createPost(content: $content){
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
            `,
            variables: { content }
        };

        const response = await fetch(API_URL, {
            method: 'POST',
            headers,
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('📦 Response:', result);

        if (result.errors) {
            console.error('GraphQL errors:', result.errors);
            await handleAuthError(result.errors);
            throw new Error(result.errors[0]?.message || 'Failed to create post');
        }

        const postData = result.data?.createPost;
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

export const getPosts = async (): Promise<Post[]> => {
    try {
        const headers = await getAuthHeaders();

        const response = await fetch(API_URL, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                query: `
                    query GetPosts {
                        posts {
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
                `,
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('📦 Posts response:', result);
        
        if (result.errors) {
            console.error('GraphQL errors:', result.errors);
            await handleAuthError(result.errors);
            return [];
        }

        const posts = result.data?.posts || [];
        
        // Transform the data to match your Post interface
        const transformedPosts = posts.map((post: any) => ({
            id: post.id,
            content: post.content,
            author: {
                id: post.user.id,
                username: post.user.username,
                firstName: post.user.firstName,
                lastName: post.user.lastName,
            },
            createdAt: post.createdAt,
            likesCount: post.likesCount || 0,
            commentsCount: 0 // Add this if your backend doesn't provide it
        }));
    
        return transformedPosts.sort((a: Post, b: Post) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    } catch (error) {
        console.error('Error fetching posts:', error);
        return [];
    }
};

// Re-authentication
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
        console.log('🧪 Testing auth with simple query...');
        
        const response = await fetch(API_URL, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                query: `
                    query {
                        me {
                            id
                            username
                        }
                    }
                `
            }),
        });

        const result = await response.json();
        console.log('🧪 Auth test result:', JSON.stringify(result, null, 2));
        
        return result;
    } catch (error) {
        console.error('🧪 Auth test failed:', error);
        return null;
    }
};