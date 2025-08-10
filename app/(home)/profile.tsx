import CustomDrawer from '@/components/common/CustomDrawer';
import { updateProfile, uploadAvatar } from '@/services/profileService';
import { styles } from '@/styles/_profile';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Modal, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Header from '../../components/common/Header';
import ProfileStats from '../../components/common/ProfileStats';

interface UserData {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string; // optional local avatar path
  bio?: string | null;
}
const ProfileScreen: React.FC = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  // Stats state
  const [postsCount, setPostsCount] = useState<number>(12);
  const [followersCount, setFollowersCount] = useState<number>(0);
  const [followingCount, setFollowingCount] = useState<number>(0);

  // Edit modal state
  const [editVisible, setEditVisible] = useState(false);
  const [editFirstName, setEditFirstName] = useState('');
  const [editLastName, setEditLastName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [saving, setSaving] = useState(false);

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

  // Load saved avatar when user id is known
  useEffect(() => {
    (async () => {
      try {
        if (!userData?.id) return;
        const key = `avatar:${userData.id}`;
        const saved = await AsyncStorage.getItem(key);
        if (saved) setAvatarUri(saved);
      } catch (e) {
        console.warn('Failed to load saved avatar', e);
      }
    })();
  }, [userData?.id]);

  // Load saved stats when user id is known
  useEffect(() => {
    (async () => {
      try {
        if (!userData?.id) return;
        const raw = await AsyncStorage.getItem(`profileStats:${userData.id}`);
        if (raw) {
          const s = JSON.parse(raw);
          if (typeof s.posts === 'number') setPostsCount(s.posts);
          if (typeof s.followers === 'number') setFollowersCount(s.followers);
          if (typeof s.following === 'number') setFollowingCount(s.following);
        }
      } catch (e) {
        console.warn('Failed to load profile stats', e);
      }
    })();
  }, [userData?.id]);

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

    const json = await response.json();
    const p = json?.data?.userProfile;
    if (p && typeof p === 'object') {
      const updated = { ...(userData || {}), ...p } as UserData;
      setUserData(updated);
      try { await AsyncStorage.setItem('userData', JSON.stringify(updated)); } catch {}
    }

  }catch (error){
    console.error("Error fetching user profile", error);
  }finally{
    setIsLoading(false);
  }
};

  // Pick and persist avatar
  const handlePickAvatar = async () => {
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (perm.status !== 'granted') {
        Alert.alert('Permission required', 'We need access to your photos to set a profile picture.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (result.canceled) return;

      const picked = result.assets?.[0]?.uri;
      if (!picked) return;

      const uid = userData?.id || 'default';
      const dest = `${FileSystem.documentDirectory}avatar_${uid}.jpg`;

      try {
        // delete if exists, then copy
        await FileSystem.deleteAsync(dest, { idempotent: true });
      } catch {}

      await FileSystem.copyAsync({ from: picked, to: dest });
      await AsyncStorage.setItem(`avatar:${uid}`, dest);
      setAvatarUri(dest);

      // Upload to backend
      const remoteUrl = await uploadAvatar(picked);
      if (remoteUrl) {
        try {
          // merge into stored user data for use in drawer/header etc
          const userRaw = await AsyncStorage.getItem('userData');
          if (userRaw) {
            const parsed = JSON.parse(userRaw);
            const updated = { ...parsed, avatarUrl: remoteUrl };
            await AsyncStorage.setItem('userData', JSON.stringify(updated));
            setUserData(updated);
          }
        } catch {}
      }
    } catch (e) {
      console.error('Avatar pick error:', e);
      Alert.alert('Error', 'Failed to set profile picture.');
    }
  };

  // Remove avatar locally (file + storage)
  const handleRemoveAvatar = async () => {
    try {
      const uid = userData?.id || 'default';
      const key = `avatar:${uid}`;
      const existing = await AsyncStorage.getItem(key);
      if (existing) {
        try { await FileSystem.deleteAsync(existing, { idempotent: true }); } catch {}
      }
      await AsyncStorage.removeItem(key);
      setAvatarUri(null);
    } catch (e) {
      console.warn('Failed to remove avatar', e);
      Alert.alert('Error', 'Could not remove profile picture.');
    }
  };

  // If avatar exists, show menu to change/remove, else open picker
  const openAvatarOptions = () => {
    if (avatarUri) {
      Alert.alert(
        'Profile photo',
        'Choose an option',
        [
          { text: 'Remove photo', style: 'destructive', onPress: handleRemoveAvatar },
          { text: 'Choose new', onPress: handlePickAvatar },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
    } else {
      handlePickAvatar();
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

  // Open edit modal and seed fields
  const openEdit = () => {
    setEditFirstName(userData?.firstName ?? '');
    setEditLastName(userData?.lastName ?? '');
    setEditBio(userData?.bio ?? '');
    setEditVisible(true);
  };

  const saveEdit = async () => {
    try {
      setSaving(true);
      const updated: UserData = {
        ...(userData as UserData),
        firstName: editFirstName.trim() || undefined,
        lastName: editLastName.trim() || undefined,
        bio: editBio.trim(),
      };
      setUserData(updated);
      try { await AsyncStorage.setItem('userData', JSON.stringify(updated)); } catch {}

      // Sync to backend
      try {
        const server = await updateProfile({
          firstName: editFirstName.trim(),
          lastName: editLastName.trim(),
          bio: editBio.trim(),
        });
        if (server && typeof server === 'object') {
          const merged = { ...updated, ...server } as UserData;
          setUserData(merged);
          try { await AsyncStorage.setItem('userData', JSON.stringify(merged)); } catch {}
        }
      } catch (e) {
        console.warn('Profile update API failed, kept local changes', e);
      }

      setEditVisible(false);
    } catch (e) {
      Alert.alert('Error', 'Failed to save profile changes.');
    } finally {
      setSaving(false);
    }
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
            <View style={{ position: 'relative' }}>
              {avatarUri ? (
                <Image source={{ uri: avatarUri }} style={styles.avatar} />
              ) : userData?.avatarUrl ? (
                <Image source={{ uri: userData.avatarUrl }} style={styles.avatar} />
              ) : (
                <View style={styles.avatar} />
              )}
              <TouchableOpacity
                onPress={openAvatarOptions}
                style={{ position: 'absolute', right: -4, bottom: -4 }}
                accessibilityLabel={avatarUri ? 'Change or remove profile photo' : 'Add profile photo'}
              >
                {avatarUri || userData?.avatarUrl ? (
                  <Ionicons name="create" size={26} color="#f9f2e7ff" />
                ) : (
                  <Ionicons name="add-circle" size={28} color="#f9f2e7ff" />
                )}
              </TouchableOpacity>
            </View>
            <Text style={styles.name}>{getDisplayName()}</Text>
            <Text style={styles.username}>{getUsername()}</Text>
            <Text style={styles.bio}>
              {userData?.bio && userData.bio.trim().length > 0
                ? userData.bio
                : 'Full-stack engineer based in Kenya 🇰🇪.\nCoffee + code = my vibe ☕️💻'}
            </Text>
            <TouchableOpacity style={styles.editButton} onPress={openEdit}>
              <Text style={styles.editText}>Edit Profile</Text>
            </TouchableOpacity>
            <ProfileStats posts={postsCount} followers={String(followersCount)} following={followingCount} />
          </View>
        </ScrollView>
      </View>

      {/* Edit Profile Modal */}
      <Modal visible={editVisible} transparent animationType="slide" onRequestClose={() => setEditVisible(false)}>
        <View style={{ flex:1, backgroundColor:'rgba(0,0,0,0.5)', justifyContent:'center', padding:16 }}>
          <View style={{ backgroundColor:'#0b1120', borderRadius:16, padding:16 }}>
            <Text style={{ color:'white', fontSize:18, fontWeight:'600', marginBottom:12 }}>Edit Profile</Text>
            {/* Names */}
            <Text style={{ color:'#94a3b8', marginBottom:6 }}>First name</Text>
            <TextInput
              value={editFirstName}
              onChangeText={setEditFirstName}
              placeholder="First name"
              placeholderTextColor="#64748b"
              style={{ color:'white', backgroundColor:'#1e293b', borderRadius:12, paddingHorizontal:12, paddingVertical:10, marginBottom:12 }}
            />
            <Text style={{ color:'#94a3b8', marginBottom:6 }}>Last name</Text>
            <TextInput
              value={editLastName}
              onChangeText={setEditLastName}
              placeholder="Last name"
              placeholderTextColor="#64748b"
              style={{ color:'white', backgroundColor:'#1e293b', borderRadius:12, paddingHorizontal:12, paddingVertical:10, marginBottom:12 }}
            />
            {/* Bio */}
            <Text style={{ color:'#94a3b8', marginBottom:6 }}>Bio</Text>
            <TextInput
              value={editBio}
              onChangeText={setEditBio}
              placeholder="Tell people about yourself"
              placeholderTextColor="#64748b"
              multiline
              numberOfLines={3}
              style={{ color:'white', backgroundColor:'#1e293b', borderRadius:12, paddingHorizontal:12, paddingVertical:10, marginBottom:16, textAlignVertical:'top' }}
            />
            {/* No stats editing here */}
            <View style={{ flexDirection:'row', justifyContent:'flex-end', gap:12 }}>
              <TouchableOpacity onPress={() => setEditVisible(false)} style={{ paddingVertical:10, paddingHorizontal:16 }}>
                <Text style={{ color:'#94a3b8' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={saveEdit} disabled={saving} style={{ backgroundColor:'#374151', paddingVertical:10, paddingHorizontal:16, borderRadius:12, minWidth:96, alignItems:'center' }}>
                {saving ? <ActivityIndicator color="#fff" /> : <Text style={{ color:'#fff', fontWeight:'600' }}>Save</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <CustomDrawer visible={drawerVisible} onClose={handleCloseDrawer} userData={userData}/>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default ProfileScreen;