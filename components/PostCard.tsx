import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet } from "react-native";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { HeartIcon, ChatBubbleOvalLeftIcon, ArrowPathIcon, ShareIcon, EllipsisHorizontalIcon } from "react-native-heroicons/outline";

interface PostCardProps {
  avatarUrl?: string;
  username: string;
  handle: string;
  timeAgo: string;
  text: string;
  imageUrl?: string;
}

const PostCard: React.FC<PostCardProps> = ({
  avatarUrl,
  username,
  handle,
  timeAgo,
  text,
  imageUrl,
}) => {
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
        <TouchableOpacity>
          <EllipsisHorizontalIcon color="white" size={24} />
        </TouchableOpacity>
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
        <TouchableOpacity style={{flexDirection: 'row'}}>
          <HeartIcon color="gray" size={24} />
          <Text style={{color: 'white', paddingLeft:4}}>178</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <ShareIcon color="gray" size={24} />
        </TouchableOpacity>
      </View>
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
    fontWeight: 600,
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
  }
});

export default PostCard;