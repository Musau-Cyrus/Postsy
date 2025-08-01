import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';

interface CustomHeaderProps {
    title: string;
    onMenuPress? : () => void;
}

export const CustomHeader: React.FC<CustomHeaderProps> = ({ title, onMenuPress }) => {
    return (
        <SafeAreaView style={styles.container}>
            <BlurView intensity={30} tint="light" style={styles.header}>
                <View style={styles.innerGlow}>
                    <TouchableOpacity onPress={onMenuPress} style={styles.leftIcon} >
                        <Ionicons name="menu" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                    
                    <Text style={styles.title}>{title}</Text>
                    
                    <TouchableOpacity onPress={onMenuPress} style={styles.rightIcon}>
                        <Ionicons name="person-circle" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
            </BlurView>
        </SafeAreaView>
    );
};

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
    rightIcon: {
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