import React from "react";
import { View, Text, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface PostDetailProps {
  image: string;
  title: string;
  username: string;
  date: string;
  description: string;
}

const PostDetail: React.FC<PostDetailProps> = ({
  image,
  title,
  username,
  date,
  description,
}) => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Post Image */}
        <Image
          source={{ uri: image }}
          className="w-full h-60 rounded-2xl mb-4"
          resizeMode="cover"
        />

        {/* Post Title */}
        <Text className="text-2xl font-bold mb-2">{title}</Text>

        {/* User & Date */}
        <View className="flex-row justify-between mb-4">
          <Text className="text-gray-500">{username}</Text>
          <Text className="text-gray-400 text-sm">{date}</Text>
        </View>

        {/* Post Description */}
        <Text className="text-base leading-6 text-gray-700">{description}</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PostDetail;
