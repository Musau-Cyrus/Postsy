import { followUser } from "@/services/userService";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
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
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [isSelf, setIsSelf] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

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
    onEdit?.();
  };
  const handleDeletePress = () => {
    setShowMenu(false);
    onDelete?.();
  };

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

      {/* Text */}
      <Text style={{ color: 'white', fontSize: 16, lineHeight: 22, marginBottom: 12 }}>{text}</Text>

      {/* Image */}
      {imageUrl && (
        <Image
          source={{ uri: imageUrl }}
          style={{ width: '100%', height: 192, borderRadius: 12, marginBottom: 12 }}
          resizeMode="cover"
        />
      )}

      {/* Footer Icons */}
      <View style={styles.footer}>
        <TouchableOpacity style={{flexDirection: 'row'}}>
          <ChatBubbleOvalLeftIcon color="gray" size={24} />
          <Text style={{color: 'white', paddingLeft:4}}>10</Text>
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
          <Text style={{color: 'white', paddingLeft:4}}>178</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <ShareIcon color="gray" size={24} />
        </TouchableOpacity>
      </View>

      {/* Inline anchored menu next to the post (top-right of card) */}
      {isSelf && showMenu && (
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
});

export default PostCard;