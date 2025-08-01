import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import Header from '../../components/common/Header';
import ProfileStats from '../../components/common/ProfileStats';
import { styles } from '@/styles/_profile';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import CustomDrawer from '@/components/common/CustomDrawer';

const ProfileScreen: React.FC = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);

  const handleMenuPress = () => {
    setDrawerVisible(true);
  }

  const handleCloseDrawer = () =>{
    setDrawerVisible(false);
  }
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
          <View >
        <Header  onMenuPress={handleMenuPress}/>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.profileSection}>
            <View style={styles.avatar} />
            <Text style={styles.name}>Cyrus Musau</Text>
            <Text style={styles.username}>@cyrus</Text>
            <Text style={styles.bio}>
              Full-stack engineer based in Kenya 🇰🇪.{"\n"}
              Coffee + code = my vibe ☕️💻
            </Text>
            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.editText}>Edit Profile</Text>
            </TouchableOpacity>
            <ProfileStats posts={12} followers="5.3K" following={200} />
          </View>
        </ScrollView>
      </View>

      <CustomDrawer visible={drawerVisible} onClose={handleCloseDrawer} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default ProfileScreen;