import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { renderToStringWithData } from '@apollo/client/react/ssr';

interface UserData{
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
}
type HeaderProps = {
  onMenuPress?: () => void;
  userData?: UserData | null;
}

const Header: React.FC<HeaderProps> = ({ onMenuPress, userData }) => {
  const getDisplayName = () => {
    if (!userData) return 'Loading...';

    if (userData.firstName && userData.lastName){
      return `${userData.firstName} ${userData.lastName}`;
    } else if (userData.firstName){
      return userData.firstName; 
    } else {
      return userData.lastName;
    }
  };

  const getUsername = () => {
    if(!userData) return '@loading';
    return `@${userData.username}`;
  }
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{getDisplayName()}</Text>
      <Text style={styles.username}>{getUsername()}</Text>
      <TouchableOpacity style={styles.menu} onPress={onMenuPress}>
        <Ionicons name="menu" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    marginTop: 50,
    padding: 10,
    backgroundColor: '#2E3440',
    borderRadius: 24,
    alignItems: 'center',
    position: 'relative',
    marginHorizontal: 20,
  },
  title: { color: 'white', fontWeight: '600', fontSize: 16 },
  username: { color: '#aaa', fontSize: 12 },
  menu: { position: 'absolute', left: 10, top: 10 },
});

export default Header;