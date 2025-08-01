import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type HeaderProps = {
  onMenuPress?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuPress }) => (
  <View style={styles.header}>
    <Text style={styles.title}>Cyrus Musau</Text>
    <Text style={styles.username}>@cyrus</Text>
    <TouchableOpacity style={styles.menu} onPress={onMenuPress}>
      <Ionicons name="menu" size={24} color="#FFFFFF" />
    </TouchableOpacity>
  </View>
);

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