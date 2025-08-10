import { useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

// Neutralized route: if accessed, immediately go back to Home
export default function DisabledPostRoute() {
  const router = useRouter();
  React.useEffect(() => {
    try {
      router.replace('/(home)/home');
    } catch {
      try { router.back(); } catch {}
    }
  }, []);
  return <View />;
}
