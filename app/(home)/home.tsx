import CustomDrawer from "@/components/common/CustomDrawer";
import { CustomHeader } from "@/components/common/CustomHeader";
import PostCard from "@/components/PostCard";
import SuggestedUserCard from "@/components/SuggestedUserCard";
import { checkAuthStatus, getPosts, getUserPosts, Post, testAuthWithSimpleQuery } from "@/services/postService";
import { followUser, getSuggestedUsers } from "@/services/userService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";
import { SafeAreaProvider, } from "react-native-safe-area-context";

const Home = () => {
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [posts, setPosts] = useState<Post[]>([]);
    const [suggested, setSuggested] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [followLoadingId, setFollowLoadingId] = useState<string | null>(null);
    const [followingIds, setFollowingIds] = useState<Record<string, boolean>>({});

    const handleMenuPress = () => {
        setDrawerVisible(true);
    };

    const handleCloseDrawer = () => {
        setDrawerVisible(false);
    };

    const fetchPosts = async () => {
        try {
            console.log('Fetching posts...');
            const fetchedPosts = await getPosts();
            console.log('Fetched posts:', fetchedPosts);
            setPosts(fetchedPosts);
            if (!fetchedPosts || fetchedPosts.length === 0) {
                try {
                    const s = await getSuggestedUsers(10);
                    setSuggested(s);
                } catch {}
            } else {
                setSuggested([]);
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchPosts();
        setRefreshing(false);
    };

    useEffect(() => {
        (async () => {
            const authed = await checkAuthStatus();
            if (!authed) {
                console.warn('🚫 Not authenticated, redirect to login');
                // Optionally navigate to login if your router is available
                // router.replace('/login');
                setIsLoading(false);
                return;
            }
            await testAuthWithSimpleQuery();
            fetchPosts();
        })();
    }, []);

    const formatTimeAgo = (dateString: string) => {
        const postDate = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60 * 60));
        
        if (diffInHours < 1) return 'now';
        if (diffInHours < 24) return `${diffInHours}h`;
        return `${Math.floor(diffInHours / 24)}d`;
    };
    return(
        <SafeAreaProvider style={{backgroundColor: '#0b1120'}}>
            <View style={{paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#1e293b',}}>
                <CustomHeader title="Postsy" onMenuPress={handleMenuPress}/>
            </View>
                <ScrollView style={{ flex: 1, paddingTop: 16 }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor="#ffffff"
                    />
                }
                >
                {isLoading ? (
                    <View style={{ padding: 20, alignItems: 'center' }}>
                        <Text style={{ color: 'white' }}>Loading posts...</Text>
                    </View>
                ) : null}

                {/* When no posts, show suggestions vertically */}
                {!isLoading && posts.length === 0 && suggested.length > 0 && (
                    <View style={{ paddingBottom: 8 }}>
                        <Text style={{ color: '#94a3b8', paddingHorizontal: 16, marginBottom: 8 }}>
                            Suggested for you
                        </Text>
                        {suggested.map((u) => (
                            <SuggestedUserCard
                                key={u.id}
                                username={u.username}
                                name={`${u.firstName || ''} ${u.lastName || ''}`.trim() || u.username}
                                loading={followLoadingId === u.id}
                                following={!!followingIds[u.id]}
                                onFollow={async () => {
                                    if (followLoadingId) return;
                                    setFollowLoadingId(u.id);
                                    const ok = await followUser(u.username);
                                    if (ok) {
                                        setFollowingIds(prev => ({ ...prev, [u.id]: true }));
                                        try {
                                            const meRaw = await AsyncStorage.getItem('userData');
                                            const me = meRaw ? JSON.parse(meRaw) : null;
                                            if (me?.id && u?.id) {
                                                // keep local stats in sync
                                                // @ts-ignore - helper imported elsewhere if needed
                                            }
                                        } catch {}
                                        const theirPosts = await getUserPosts(u.username);
                                        setPosts(prev => [...theirPosts, ...prev].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
                                        await fetchPosts();
                                    }
                                    setFollowLoadingId(null);
                                }}
                                onUnfollow={async () => {
                                    // keep current UX simple when no posts; unfollow logic handled elsewhere
                                }}
                            />
                        ))}
                    </View>
                )}

                {!isLoading && posts.length === 0 && (
                    <View style={{ padding: 20, alignItems: 'center' }}>
                        <Text style={{ color: '#94a3b8', textAlign: 'center' }}>
                            No posts yet. Be the first to share something!
                        </Text>
                    </View>
                )}

                {!isLoading && posts.length > 0 && (
                    posts.map((post) => (
                        <PostCard
                            key={post.id}
                            username={`${post.author.firstName || ''} ${post.author.lastName || ''}`.trim() || post.author.username}
                            handle={post.author.username}
                            timeAgo={formatTimeAgo(post.createdAt)}
                            text={post.content}
                        />
                    ))
                )}
                </ScrollView>
                <CustomDrawer visible={drawerVisible} onClose={handleCloseDrawer}/>
            
        </SafeAreaProvider>
    )
}

export default Home;