import HeaderButton from "@/components/common/HeaderButton";
import React from "react";
import { Alert, SafeAreaView, ScrollView } from "react-native";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { ArrowLeftIcon, MagnifyingGlassIcon, HomeIcon, PlusIcon, UserIcon } from "react-native-heroicons/outline";
import { SafeAreaProvider } from "react-native-safe-area-context";

const ExploreScreen = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* Header - Fixed at top */}
        <View style={styles.headerContainer}>
          <HeaderButton label="Explore" onPress={() => console.log("Explore pressed")} />
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
            />
            <TouchableOpacity>
              <MagnifyingGlassIcon color="gray" size={20} />
            </TouchableOpacity>
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