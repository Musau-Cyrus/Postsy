import React, { useEffect } from 'react';
import { View, Text, } from 'react-native';
import { styles } from '@/styles/_splash';
import { useRouter } from 'expo-router';


const SplashScreen = () => {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() =>{
      router.replace('/login')
    }, 3000);
    return () => clearTimeout(timeout);
  }, [router])

  return (
    <View style={styles.container}>
      {/* Diagonal Overlay */}
      <View style={styles.diagonalOverlay} />

      {/* Center Logo */}
      <View style={styles.centerContent}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>P</Text>
        </View>
        <Text style={styles.appName}>Postsy</Text>
      </View>
    </View>
  );
};

export default SplashScreen;