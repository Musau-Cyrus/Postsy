import { createPost, Post as PostType } from '@/services/postService';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from "react";
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { CameraIcon, PaperAirplaneIcon, PhotoIcon } from "react-native-heroicons/outline";

interface PostInputProps {
  onPosted?: (post: PostType) => void;
}

const PostInput: React.FC<PostInputProps> = ({ onPosted }) => {
  const [text, setText ] = useState('');
  const [selectedImage, setSelectedImage ] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

    const handlePost = async () => {
       if (!text.trim()) {
      Alert.alert('Error', 'Please enter some text for your post');
      return;
    }

    setIsLoading(true);
    try {
      const newPost = await createPost(text.trim());
      if (newPost) {
        onPosted?.(newPost);
        setText('');
        setSelectedImage(null);
      } else {
        Alert.alert('Error', 'Failed to create post. Please try again.');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert('Error', 'Failed to create post. Please try again.');
    } finally {
      setIsLoading(false);
    }
    };

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if( status !== "granted"){
            Alert.alert("Permision Required!")
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.canceled){
            setSelectedImage(result.assets[0].uri);
        }
    };

    const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync()
        if ( status !== "granted"){
            Alert.alert("Camera permission required!")
            return;
        }
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes:ImagePicker.MediaTypeOptions.Images,
            allowsEditing:true,
            aspect: [4, 3],
            quality: 1,
        })
        if (!result.canceled){
            setSelectedImage(result.assets[0].uri);
        }
    }

  return (
    <View style={styles.container}>
      {/* Input */}
      <TextInput
        placeholder="What's on your mind ?"
        placeholderTextColor="#94a3b8"
        value={text}
        onChangeText={setText}
        multiline
        style={{color: 'white'}}
        editable={!isLoading}
      />
       {/* Preview selected image */}
      {selectedImage && (
        <Image
          source={{ uri: selectedImage }}
          style={{ width: '100%', height: 160, marginTop: 8, borderRadius: 8 }}
          resizeMode="cover"
        />
      )}

      {/* Actions */}
      <View style={styles.action}>
        <View style={styles.mediaButtons}>
            <TouchableOpacity onPress={pickImage} style={styles.mediaButton} disabled={isLoading}>
          <PhotoIcon color="#94a3b8" size={24} />
        </TouchableOpacity>

        <TouchableOpacity onPress={takePhoto} style={styles.mediaButton} disabled={isLoading}>
            <CameraIcon color='#94a3b8' size={24}/>
        </TouchableOpacity>
        </View>

        {/* Post Button */}
        <TouchableOpacity
          onPress={handlePost}
          style = {styles.postButton}
          disabled={isLoading}
        >
          <Text style={styles.text}>{isLoading ? 'Posting...' : 'Post'}</Text>
          <PaperAirplaneIcon color="#94a3b8" size={18} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PostInput;

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#1e293b",
        padding: 3,
        borderRadius: 16,
    },
    action: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 3,
        marginBottom: 10,
        marginHorizontal: 42
    },
    postButton:{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#374151',
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderRadius: 16,
    },
    text: {
        color: 'white',
        marginRight: 1,
    },
    mediaButton: {
        marginTop:10,
        padding: 4,
    },
    mediaButtons: {
        flexDirection: "row",
        gap: 12,
    }
})
