import { BlurView } from "expo-blur";
import React from "react";
import { View, Text, TouchableOpacity, ViewStyle, TextStyle, StyleSheet, SafeAreaView } from "react-native";
import { ArrowLeftIcon } from "react-native-heroicons/outline";

interface HeaderButtonProps {
  label: string;
  onPress?: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const HeaderButton: React.FC<HeaderButtonProps> = ({ label, onPress, style, textStyle }) => {
  return (
    <SafeAreaView style={styles.container}>
            <BlurView intensity={30} tint="light" style={styles.header}>
                <View style={styles.innerGlow}>
                    <TouchableOpacity onPress={onPress} style={styles.leftIcon} >
                        <ArrowLeftIcon color="white" size={20} />
                    </TouchableOpacity>
                    
                    <Text style={styles.title}>{label}</Text>
                </View>
            </BlurView>
        </SafeAreaView>
  );
    
};

export default HeaderButton;

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'transparent',
    },
    header: {
        marginHorizontal: 16,
        borderRadius: 20,
        overflow: 'hidden',
        height: 52,
    },
    innerGlow: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    leftIcon: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        flex: 1,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
    },
});
