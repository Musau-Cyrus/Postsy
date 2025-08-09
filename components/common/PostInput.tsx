import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, Image } from "react-native";
import { PaperAirplaneIcon, PhotoIcon, CameraIcon } from "react-native-heroicons/outline";
import * as ImagePicker from 'expo-image-picker';
import { createPost } from '@/services/postService';


const PostInput = () => {
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
      console.log('Creating post with text:', text);
      
      const newPost = await createPost(text.trim());
      
      if (newPost) {
        console.log('Post created successfully:', newPost);
        Alert.alert('Success', 'Post created successfully!');
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
        setText('');
        setSelectedImage(null)
    };

    const pickImage = async () => {
        //Asking for Permision from user
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if( status !== "granted"){
            Alert.alert("Permision Required!")
            return;
        }

        //Launch the image picker
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled){
            setSelectedImage(result.assets[0].uri);
            console.log("Selected Image", result.assets[0].uri )
        }
    };

    const takePhoto = async () => {
        //Ask for user permision to access camera
        const { status } = await ImagePicker.requestCameraPermissionsAsync()
        if ( status !== "granted"){
            Alert.alert("Camera permission required!")
            return;
        }

        //Launch camera
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes:ImagePicker.MediaTypeOptions.Images,
            allowsEditing:true,
            aspect: [4, 3],
            quality: 1,
        })
        if (!result.canceled){
            setSelectedImage(result.assets[0].uri);
            console.log("Captured Image", result.assets[0].uri)
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
            <TouchableOpacity onPress={pickImage} style={styles.mediaButton}>
          <PhotoIcon color="#94a3b8" size={24} />
        </TouchableOpacity>

        <TouchableOpacity onPress={takePhoto} style={styles.mediaButton}>
            <CameraIcon color='#94a3b8' size={24}/>
        </TouchableOpacity>
        </View>

        {/* Post Button */}
        <TouchableOpacity
          onPress={handlePost}
          style = {styles.postButton}
        >
          <Text style={styles.text}>Post</Text>
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
