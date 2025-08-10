import HeaderButton from "@/components/common/HeaderButton";
import { router } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Alert, ActivityIndicator, SafeAreaView, ScrollView } from "react-native";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { MagnifyingGlassIcon} from "react-native-heroicons/outline";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { searchUsers, User } from "@/services/searchService";

const ExploreScreen = () => {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);
  const debouncer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onChangeText = (text: string) => {
    setTouched(true);
    setQuery(text);
    if (debouncer.current) clearTimeout(debouncer.current);
    debouncer.current = setTimeout(async () => {
      const q = text.trim();
      if (q.length < 2) {
        setUsers([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const data = await searchUsers(q);
        setUsers(data);
      } catch (e) {
        console.error('Search error:', e);
        Alert.alert('Search failed', 'Please try again.');
      } finally {
        setLoading(false);
      }
    }, 400);
  };

  useEffect(() => {
    return () => {
      if (debouncer.current) clearTimeout(debouncer.current);
    };
  }, []);

  const onSubmit = async () => {
    if (!query.trim()) return;
    setTouched(true);
    setLoading(true);
    try {
      const data = await searchUsers(query.trim());
      setUsers(data);
    } catch (e) {
      console.error('Search error:', e);
      Alert.alert('Search failed', 'Please try again.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* Header - Fixed at top */}
        <View style={styles.headerContainer}>
          <HeaderButton label="Explore" onPress={() => router.push('/(home)/home')} />
        </View>

        {/* Scrollable Content */}
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          {/* Search Bar */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#1e293b',
            marginHorizontal: 16,
            marginTop: 16,
            paddingHorizontal: 12,
            paddingVertical: 12,
            borderRadius: 8,
          }}>
            
            <TextInput
              placeholder="Search posts, users ..."
              placeholderTextColor="#94a3b8"
              style={{
                marginLeft: 8,
                flex: 1,
                color: 'white',
                fontSize: 16,
                borderRadius: 16,
              }}
              autoCapitalize="none"
              value={query}
              onChangeText={onChangeText}
              onSubmitEditing={onSubmit}
              returnKeyType="search"
            />
            <TouchableOpacity>
              <MagnifyingGlassIcon color="gray" size={20} />
            </TouchableOpacity>
          </View>

           {/* Results */}
          <View style={{ marginTop: 16, paddingHorizontal: 16 }}>
            {loading ? (
              <View style={{ paddingVertical: 24, alignItems: 'center' }}>
                <ActivityIndicator color="#94a3b8" />
              </View>
            ) : users.length > 0 ? (
              users.map((u) => (
                <TouchableOpacity
                  key={u.id}
                  onPress={() => {
                    // Navigate to profile screen if available; adjust route as needed
                    // router.push(`/(home)/profile/${u.id}`);
                    Alert.alert('User', `${u.username}${u.firstName ? ` (${u.firstName} ${u.lastName ?? ''})` : ''}`);
                  }}
                  style={{
                    paddingVertical: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: '#1e293b',
                    flexDirection: 'row',
                    alignItems: 'center'
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                      @{u.username}
                    </Text>
                    {(u.firstName || u.lastName) && (
                      <Text style={{ color: '#94a3b8', fontSize: 14 }}>
                        {u.firstName ?? ''} {u.lastName ?? ''}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))
            ) : touched && query.trim().length >= 2 ? (
              <Text style={{ color: '#94a3b8', paddingVertical: 24 }}>No users found.</Text>
            ) : null}
          </View>

          {/* Content */}
          <View style={{
            marginTop: 16,
            paddingHorizontal: 16,
          }}>
            <Text style={{
              color: 'white',
              fontSize: 18,
              fontWeight: '600',
              marginBottom: 12,
            }}>Trending Now</Text>
            {/* You can map trending posts here */}
          </View>
        </ScrollView>
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

export default ExploreScreen;