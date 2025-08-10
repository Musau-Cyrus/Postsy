import PostCard from '@/components/PostCard';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ArrowLeftIcon } from 'react-native-heroicons/outline';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PostDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    id: string;
    content?: string;
    handle?: string;
    username?: string;
    time?: string;
    likes?: string;
    comments?: string;
  }>();

  const { id, content, handle, username, time, likes, comments } = params;
  const displayName = (username || handle || 'User') as string;
  const authorHandle = (handle || 'user') as string;
  const timeAgo = (time || 'now') as string;
  const postId = (id as string) || '';
  const text = (content || 'No content available.') as string;
  const likesCount = Number(likes ?? '0') || 0;
  const commentsCount = Number(comments ?? '0') || 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0b1120' }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeftIcon color="white" size={20} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Post</Text>
        <View style={{ width: 50 }} />
      </View>
      <ScrollView contentContainerStyle={{ paddingVertical: 16 }}>
        {/* Post content using the shared card */}
        <PostCard
          postId={postId}
          username={displayName}
          handle={authorHandle}
          timeAgo={timeAgo}
          text={text}
          likesCount={likesCount}
          commentsCount={commentsCount}
        />

        {/* Comments section */}
        <View style={{ marginTop: 8, paddingHorizontal: 16 }}>
          <Text style={{ color: '#94a3b8', marginBottom: 8 }}>Comments</Text>
          <View style={styles.commentEmpty}> 
            <Text style={{ color: '#94a3b8' }}>No comments yet.</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  headerTitle: { color: 'white', fontSize: 18, fontWeight: '600' },
  commentEmpty: {
    borderWidth: 1,
    borderColor: '#374151',
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
});
