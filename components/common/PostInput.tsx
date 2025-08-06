import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from "react-native";
import { PaperAirplaneIcon, PhotoIcon } from "react-native-heroicons/outline";

const PostInput = () => {
  const [text, setText] = useState("");

  const handlePost = () => {
    console.log("Posting:", text);
    setText("");
  };

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

      {/* Actions */}
      <View style={styles.action}>
        <TouchableOpacity>
          <PhotoIcon color="#94a3b8" size={22} />
        </TouchableOpacity>

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
    }
})
