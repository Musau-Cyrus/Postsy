import { addComment, Comment, getComments } from '@/services/postService';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { PaperAirplaneIcon } from 'react-native-heroicons/outline';

export interface CommentsSectionProps {
  postId: string;
  initialCount?: number;
  onCountChange?: (count: number) => void;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ postId, initialCount = 0, onCountChange }) => {
  const [commentText, setCommentText] = useState('');
  const [commentsList, setCommentsList] = useState<Comment[]>([]);
  const [commentsCount, setCommentsCount] = useState(initialCount);
  const [loadingComments, setLoadingComments] = useState(false);
  const [posting, setPosting] = useState(false);

  const loadComments = async () => {
    if (!postId) return;
    try {
      setLoadingComments(true);
      const list = await getComments(postId);
      setCommentsList(list);
    } finally {
      setLoadingComments(false);
    }
  };

  useEffect(() => { loadComments(); }, [postId]);

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    try {
      setPosting(true);
      const created = await addComment(postId, commentText.trim());
      if (created) {
        setCommentsList(prev => [created, ...prev]);
        setCommentsCount(c => {
          const next = c + 1;
          onCountChange?.(next);
          return next;
        });
        setCommentText('');
      } else {
        Alert.alert('Error', 'Failed to add comment.');
      }
    } catch (e: any) {
      const msg = e?.message || 'Failed to add comment.';
      Alert.alert('Error', msg);
    } finally {
      setPosting(false);
    }
  };

  return (
    <View style={{ marginTop: 8, paddingHorizontal: 16 }}>
      <Text style={{ color: '#94a3b8', marginBottom: 8 }}>Comments</Text>
      {loadingComments ? (
        <Text style={{ color: '#94a3b8' }}>Loading comments...</Text>
      ) : commentsList.length === 0 ? (
        <View style={styles.commentEmpty}>
          <Text style={{ color: '#94a3b8' }}>No comments yet.</Text>
        </View>
      ) : (
        <View style={{ gap: 12 }}>
          {commentsList.map(c => (
            <View key={c.id} style={styles.commentItem}>
              <Text style={styles.commentAuthor}>@{c.author.username}</Text>
              <Text style={styles.commentBody}>{c.content}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Add comment */}
      <View style={styles.addRow}>
        <TextInput
          style={styles.input}
          placeholder="Add a comment..."
          placeholderTextColor="#64748b"
          value={commentText}
          onChangeText={setCommentText}
          editable={!posting}
        />
        <TouchableOpacity style={styles.sendBtn} disabled={posting || !commentText.trim()} onPress={handleAddComment}>
          <PaperAirplaneIcon color="#cbd5e1" size={18} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  commentEmpty: {
    borderWidth: 1,
    borderColor: '#374151',
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  addRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 12,
    color: 'white',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  sendBtn: {
    backgroundColor: '#1f2937',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#374151',
  },
  commentItem: {
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 12,
    padding: 12,
  },
  commentAuthor: { color: '#93c5fd', marginBottom: 4 },
  commentBody: { color: '#e5e7eb' },
});

export default CommentsSection;
