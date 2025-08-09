import CustomDrawer from "@/components/common/CustomDrawer";
import { CustomHeader } from "@/components/common/CustomHeader";
import PostCard from "@/components/PostCard";
import { useEffect, useState } from "react";
import { View, ScrollView, Text,RefreshControl } from "react-native";
import { SafeAreaProvider, } from "react-native-safe-area-context";
import { getPosts, Post } from "@/services/postService";

const Home = () => {
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

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
        fetchPosts();
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
                ) : posts.length === 0 ? (
                    <View style={{ padding: 20, alignItems: 'center' }}>
                        <Text style={{ color: '#94a3b8', textAlign: 'center' }}>
                            No posts yet. Be the first to share something!
                        </Text>
                    </View>
                ) : (
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