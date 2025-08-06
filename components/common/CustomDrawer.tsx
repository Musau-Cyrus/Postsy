import { router } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface UserData {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

type CustomDrawerProps = {
  visible: boolean;
  onClose: () => void;
  userData?: UserData | null;
}

const CustomDrawer: React.FC<CustomDrawerProps> = ({ visible, onClose, userData }) => {

  const getDisplayName = () => {
    if(!userData) return 'Loading...';

    if(userData.firstName &&userData.lastName){
      return `${userData.firstName} ${userData.lastName}`;
    } else if (userData.firstName) {
      return userData.firstName;
    }else{
      return userData.lastName;
    }
  };

  const getUsername = () => {
    if(!userData) return '@loading';
    return `@${userData.username}`;
  }
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.profileSection}>
            <View style={styles.avatar} />
            <Text style={styles.name}>{getDisplayName()}</Text>
            <Text style={styles.username}>{getUsername()}</Text>
            <Text style={styles.bio}>Full-stack engineer based in Kenya 🇰🇪{"\n"}Coffee + code = my vibe ☕💻</Text>
          </View>

          <View style={styles.followSection}>
            <Text style={styles.followText}>Followers{"\n"}<Text style={styles.followNumber}>5.3k</Text></Text>
            <Text style={styles.followText}>Following{"\n"}<Text style={styles.followNumber}>200</Text></Text>
          </View>

          <TouchableOpacity style={styles.optionButton}>
            <Icon name="settings-outline" size={20} color="#fff" />
            <Text style={styles.optionText}>Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionButton}>
            <Icon name="person-circle-outline" size={20} color="#fff" />
            <Text style={styles.optionText}>Switch account</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.signOutButton} onPress={() => router.push('/login')}>
            <Text style={styles.signOutText}>Sign out</Text>
            <Icon name="log-out-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} />
      </View>
    </Modal>
  );
};

export default CustomDrawer;

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flexDirection: 'row',
  },
  backdrop: {
    flex: 1,
  },
  container: {
    backgroundColor: '#0a0e23',
    width: width * 0.8,
    height: height,
    paddingBottom: 20,
  },
  profileSection: {
    padding: 20,
    borderBottomColor: '#1e1e2f',
    borderBottomWidth: 1,
    paddingTop: 60,
  },
  avatar: {
    height: 60,
    width: 60,
    backgroundColor: '#ccc',
    borderRadius: 30,
    marginBottom: 10,
  },
  name: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  username: {
    color: '#aaa',
    marginBottom: 8,
  },
  bio: {
    color: '#ccc',
    fontSize: 13,
    lineHeight: 18,
  },
  followSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    borderBottomColor: '#1e1e2f',
    borderBottomWidth: 1,
  },
  followText: {
    color: '#ccc',
    fontSize: 12,
    textAlign: 'center',
  },
  followNumber: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    gap: 15,
  },
  optionText: {
    color: '#fff',
    fontSize: 14,
  },
  signOutButton: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#1a1a2e',
    marginHorizontal: 15,
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  signOutText: {
    color: '#fff',
    fontSize: 14,
  },
});