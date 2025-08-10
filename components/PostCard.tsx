import CommentsSection from "@/components/CommentsSection";
import { deletePost, updatePost } from "@/services/postService";
import { followUser } from "@/services/userService";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { ArrowPathIcon, ChatBubbleOvalLeftIcon, EllipsisHorizontalIcon, HeartIcon, ShareIcon } from "react-native-heroicons/outline";
import { HeartIcon as HeartIconSolid } from "react-native-heroicons/solid";

interface PostCardProps {
  avatarUrl?: string;
  username: string;
  handle: string; // author's username
  timeAgo: string;
  text: string;
  imageUrl?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  postId?: string;
  likesCount?: number;
  commentsCount?: number;
}

const PostCard: React.FC<PostCardProps> = ({
  avatarUrl,
  username,
  handle,
  timeAgo,
  text,
  imageUrl,
  onEdit,
  onDelete,
  postId,
  likesCount = 0,
  commentsCount = 0,
}) => {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [isSelf, setIsSelf] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(text);
  const [content, setContent] = useState(text);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [localCommentsCount, setLocalCommentsCount] = useState<number>(commentsCount || 0);

  useEffect(() => { setContent(text); }, [text]);
  useEffect(() => { setLocalCommentsCount(commentsCount || 0); }, [commentsCount]);

  useEffect(() => {
    (async () => {
      try {
        const meRaw = await AsyncStorage.getItem('userData');
        const me = meRaw ? JSON.parse(meRaw) : null;
        if (me?.username && handle) {
          setIsSelf(me.username === handle);
        }
      } catch {}
    })();
  }, [handle]);

  const handleLikePress = () => {
    setIsLiked(!isLiked);
  };

  const handleFollowPress = async () => {
    if (isSelf || isFollowLoading || isFollowing) return;
    try {
      setIsFollowLoading(true);
      const ok = await followUser(handle);
      if (ok) setIsFollowing(true);
    } finally {
      setIsFollowLoading(false);
    }
  };

  const handleEditPress = () => {
    setShowMenu(false);
    setDraft(content);
    setIsEditing(true);
  };
  const handleDeletePress = () => {
    setShowMenu(false);
    setIsEditing(false);
    setConfirmDelete(true);
  };

  const saveEdit = async () => {
    if (!postId) return;
    try {
      setSavingEdit(true);
      const updated = await updatePost(postId, draft.trim());
      if (updated) {
        setContent(updated.content);
        onEdit?.();
        setIsEditing(false);
      }
    } finally {
      setSavingEdit(false);
    }
  };

  const confirmDeleteNow = async () => {
    if (!postId) return;
    try {
      setDeleting(true);
      const ok = await deletePost(postId);
      if (ok) {
        setIsDeleted(true);
        onDelete?.();
        setConfirmDelete(false);
      }
    } finally {
      setDeleting(false);
    }
  };

  if (isDeleted) return null;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="person-circle" size={24} color="#FFFFFF" />
        <View>
          <Text style={styles.names}>{username}</Text>
          <Text style={styles.subtext}>
            @{handle} · {timeAgo}
          </Text>
        </View>
        {isSelf ? (
          <TouchableOpacity onPress={() => setShowMenu(v => !v)}>
            <EllipsisHorizontalIcon color="white" size={24} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={handleFollowPress}
            disabled={isFollowLoading || isFollowing}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 999,
              borderWidth: 1,
              borderColor: isFollowing ? '#475569' : '#3b82f6',
              backgroundColor: isFollowing ? '#334155' : 'transparent',
            }}
          >
            <Text style={{ color: isFollowing ? '#cbd5e1' : '#3b82f6', fontWeight: '600' }}>
              {isFollowLoading ? '...' : isFollowing ? 'Following' : 'Follow'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Edit mode or content */}
      {isEditing ? (
        <View style={{ gap: 8 }}>
          <Text style={{ color: '#94a3b8', marginBottom: 4 }}>Edit post</Text>
          <View style={{ backgroundColor: '#111827', borderRadius: 8, borderWidth: 1, borderColor: '#374151' }}>
            <TextInput
              value={draft}
              onChangeText={setDraft}
              multiline
              style={{ color: 'white', padding: 12, minHeight: 80 }}
            />
          </View>
          <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
            <TouchableOpacity onPress={() => setIsEditing(false)} style={styles.btnSecondary}>
              <Text style={{ color: '#e5e7eb' }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity disabled={savingEdit || !draft.trim()} onPress={saveEdit} style={styles.btnPrimary}>
              <Text style={{ color: '#e5e7eb' }}>{savingEdit ? 'Saving...' : 'Save'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        // Text
        <Text style={{ color: 'white', fontSize: 16, lineHeight: 22, marginBottom: 12 }}>{content}</Text>
      )}

      {/* Image */}
      {imageUrl && !isEditing && (
        <Image
          source={{ uri: imageUrl }}
          style={{ width: '100%', height: 192, borderRadius: 12, marginBottom: 12 }}
          resizeMode="cover"
        />
      )}

      {/* Footer */}
      {!isEditing && (
        <View style={styles.footer}>
          <TouchableOpacity style={{flexDirection: 'row'}} onPress={() => setShowComments(v => !v)}>
            <ChatBubbleOvalLeftIcon color="gray" size={24} />
            <Text style={{color: 'white', paddingLeft:4}}>{localCommentsCount ?? 0}</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <ArrowPathIcon color="gray" size={24} />
          </TouchableOpacity>
          <TouchableOpacity style={{flexDirection: 'row'}} onPress={handleLikePress}>
            {isLiked ? (
              <HeartIconSolid color="#ef4444" size={24} />
            ) : (
              <HeartIcon color="gray" size={24} />
            )}
            <Text style={{color: 'white', paddingLeft:4}}>{likesCount ?? 0}</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <ShareIcon color="gray" size={24} />
          </TouchableOpacity>
        </View>
      )}

      {/* Comments inline */}
      {showComments && !isEditing && postId && (
        <CommentsSection
          postId={postId}
          initialCount={localCommentsCount}
          onCountChange={setLocalCommentsCount}
        />
      )}

      {/* Inline anchored menu */}
      {isSelf && showMenu && !isEditing && (
        <View style={styles.menuOverlay} pointerEvents="box-none">
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setShowMenu(false)} />
          <View style={styles.menuCardLocal}>
            <TouchableOpacity style={styles.menuItem} onPress={handleEditPress}>
              <Text style={{ color: '#e5e7eb', fontSize: 16 }}>Edit</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.menuItem} onPress={handleDeletePress}>
              <Text style={{ color: '#ef4444', fontSize: 16 }}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Confirm delete inline sheet */}
      {confirmDelete && (
        <View style={styles.menuOverlay} pointerEvents="box-none">
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setConfirmDelete(false)} />
          <View style={[styles.menuCardLocal, { width: 240 }] }>
            <Text style={{ color: '#e5e7eb', fontSize: 16, padding: 12 }}>Delete this post?</Text>
            <View style={styles.divider} />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 12, padding: 12 }}>
              <TouchableOpacity onPress={() => setConfirmDelete(false)} style={styles.btnSecondarySmall}>
                <Text style={{ color: '#e5e7eb' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity disabled={deleting} onPress={confirmDeleteNow} style={styles.btnDangerSmall}>
                <Text style={{ color: '#fee2e2' }}>{deleting ? 'Deleting...' : 'Delete'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#262d43',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header :{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems:'flex-start',
    marginBottom: 12
  },
  names: {
    color: "white",
    fontWeight: '600',
    fontSize: 16
  },
  subtext: {
    color: '#9CA3AF',
    fontSize:12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#4B5563',
  },
  // Local anchored menu overlay constrained to the card
  menuOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  menuCardLocal: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#1f2937',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#374151',
    width: 180,
    overflow: 'hidden',
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#374151',
  },
  btnPrimary: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#2563eb',
    borderRadius: 8,
  },
  btnSecondary: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#374151',
    borderRadius: 8,
  },
  btnSecondarySmall: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#374151',
    borderRadius: 8,
  },
  btnDangerSmall: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#991b1b',
    borderRadius: 8,
  },
});

export default PostCard;
