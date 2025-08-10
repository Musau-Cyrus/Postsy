import CommentsSection from '@/components/CommentsSection';
import PostCard from '@/components/PostCard';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { XMarkIcon } from 'react-native-heroicons/outline';
import { SafeAreaView } from 'react-native-safe-area-context';

export interface PostDetailsProps {
  postId: string;
  content: string;
  handle: string;
  username: string;
  timeAgo: string;
  likesCount?: number;
  initialCommentsCount?: number;
  onClose?: () => void;
}

export default function PostDetails({
  postId,
  content,
  handle,
  username,
  timeAgo,
  likesCount = 0,
  initialCommentsCount = 0,
  onClose,
}: PostDetailsProps) {
  const [commentsCount, setCommentsCount] = React.useState(initialCommentsCount);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0b1120' }}>
      <View style={styles.header}>
        {onClose ? (
          <TouchableOpacity onPress={onClose}>
            <XMarkIcon color="white" size={22} />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 22 }} />
        )}
        <Text style={styles.headerTitle}>Post</Text>
        <View style={{ width: 22 }} />
      </View>

      <PostCard
        postId={postId}
        username={username || handle || 'User'}
        handle={handle}
        timeAgo={timeAgo}
        text={content || 'No content available.'}
        likesCount={likesCount}
        commentsCount={commentsCount}
      />

      <CommentsSection
        postId={postId}
        initialCount={initialCommentsCount}
        onCountChange={setCommentsCount}
      />
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
});
