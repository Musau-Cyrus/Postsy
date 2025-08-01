import React from 'react';
import { Text, Pressable, StyleSheet, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';

interface GlassButtonProps {
  label: string;
  onPress: () => void;
  style?: ViewStyle;
}

const GlassButton: React.FC<GlassButtonProps> = ({ label, onPress, style }) => {
  return (
    <Pressable onPress={onPress} style={style}>
      <BlurView intensity={40} tint="dark" style={styles.button}>
        <Text style={styles.label}>{label}</Text>
      </BlurView>
    </Pressable>
  );
};

export default GlassButton;

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  
  },
  label: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});