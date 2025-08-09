import HeaderButton from "@/components/common/HeaderButton";
import PostInput from "@/components/common/PostInput";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, SafeAreaView } from "react-native";
import { View, StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

const NewPost = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* Header - Fixed at top */}
        <View style={styles.headerContainer}>
          <HeaderButton label="New Post" onPress={() => router.push('/(home)/home')} />
        </View>

        <View style={{marginTop: 16, marginHorizontal: 16,}}>
            <PostInput/>
        </View>
        

        
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b1120'
  },
  headerContainer: {
    backgroundColor: '#0b1120',
    paddingBottom: 8,
    paddingTop: 52,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    
  },
});

export default NewPost;