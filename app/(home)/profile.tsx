import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import Header from '../../components/common/Header';
import ProfileStats from '../../components/common/ProfileStats';
import { styles } from '@/styles/_profile';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import CustomDrawer from '@/components/common/CustomDrawer';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserData {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
}
const ProfileScreen: React.FC = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleMenuPress = () => {
    setDrawerVisible(true);
  }

  const handleCloseDrawer = () =>{
    setDrawerVisible(false);
  }

  useEffect(() => {
  const fetchUserData = async () => {
    setIsLoading(true);
    try{
      const storedUserData = await AsyncStorage.getItem('userData');
      console.log('Stored user data:', storedUserData);
      
      if(storedUserData){
        const parsedUserData = JSON.parse(storedUserData);
        console.log('Parsed user data:', parsedUserData);
        setUserData(parsedUserData);
      }

      const authToken = await AsyncStorage.getItem('authToken');
      console.log('Auth token:', authToken);
      
      if(authToken){
        await fetchUserProfile(authToken);
      } else {
        console.log('No auth token found');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }finally{
      setIsLoading(false);
    }
  };
  fetchUserData();
}, []);

  const fetchUserProfile = async (token: string) => {
  try{
    console.log('Fetching user profile with token:', token);
    const response = await fetch('https://social-media-project-9u8u.onrender.com/graphql/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        query: `
          query GetUserProfile{
            userProfile{
              id
              username
              email
              firstName
              lastName
            }
          }
        `,
      }),
    });

  }catch (error){
    console.error("Error fetching user profile", error);
  }finally{
    setIsLoading(false);
  }
};

  // Format display name
  const getDisplayName = () => {
    if (!userData) return 'Loading...';
    
    if (userData.firstName && userData.lastName) {
      return `${userData.firstName} ${userData.lastName}`;
    } else if (userData.firstName) {
      return userData.firstName;
    } else {
      return userData.username;
    }
  };

  // Format username
  const getUsername = () => {
    if (!userData) return '@loading';
    return `@${userData.username}`;
  };

  if (isLoading) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <View style={styles.loadingContainer}>
            <Text style={{color: 'white'}}>Loading profile...</Text>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
          <View >
        <Header  onMenuPress={handleMenuPress} userData={userData} />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.profileSection}>
            <View style={styles.avatar} />
            <Text style={styles.name}>{getDisplayName()}</Text>
            <Text style={styles.username}>{getUsername()}</Text>
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

      <CustomDrawer visible={drawerVisible} onClose={handleCloseDrawer} userData={userData}/>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default ProfileScreen;