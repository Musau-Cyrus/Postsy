import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type ProfileStatsProps = {
  posts: number;
  followers: string;
  following: number;
};

const ProfileStats: React.FC<ProfileStatsProps> = ({ posts, followers, following }) => (
  <View style={styles.container}>
    <Stat label="Posts" value={posts.toString()} />
    <Stat label="Followers" value={followers} />
    <Stat label="Following" value={following.toString()} />
  </View>
);

type StatProps = {
  label: string;
  value: string;
};

const Stat: React.FC<StatProps> = ({ label, value }) => (
  <View style={styles.stat}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
    
  </View>
);

const styles = StyleSheet.create({
  container: {
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  marginTop: 24,
                },
                stat: { alignItems: 'center' },
                value: { color: 'white', fontSize: 16, fontWeight: 'bold', marginHorizontal:40},
                label: { color: '#ccc', fontSize: 18, paddingBottom:4 },
              });
              
              export default ProfileStats;

