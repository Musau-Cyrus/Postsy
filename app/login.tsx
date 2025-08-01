import { View, Text, TextInput, TouchableOpacity, Image, Alert, TouchableHighlight } from "react-native";

import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { styles } from "@/styles/_login";
import Button from '../components/common/Button';
import { BlurView } from 'expo-blur';
import { useState } from "react";
import { router } from "expo-router";


export default function Login (){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <View>
                    <View>
                        <Text style={styles.title}>Welcome back!</Text>
                        <Text style={styles.subtitle}>Cyrus</Text> {/*Placeholder text for Name */}
                    </View>
                    <View>
                        <Text style={styles.label}>Username</Text>
                        <BlurView intensity={30} tint="light" style={{ borderRadius: 16, overflow: 'hidden' }}>
                            <TextInput 
                                placeholder="Username" 
                                placeholderTextColor={'#ccc'} 
                                style={styles.input}
                                value={username}
                                onChangeText={setUsername}
                            />
                        </BlurView>
                    </View>
                    <View>
                    <Text style={styles.label}>Password</Text>
                    <BlurView intensity={30} tint="light" style={{ borderRadius: 16, overflow: 'hidden' }}>
                      <View style={styles.passwordContainer}>
                        
                        <TextInput
                        style={{flex: 1, paddingVertical: 12, color: 'white'}}
                        placeholder="Password"
                        placeholderTextColor="#ccc"
                        value={password}
                        secureTextEntry={!isPasswordVisible}
                        onChangeText={setPassword}
                        />
                        <TouchableOpacity
                            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                        >
                        <Ionicons
                            name={isPasswordVisible ? 'eye' : 'eye-off'}
                            size={20}
                            color="#ccc"
                        />
                        </TouchableOpacity>
                        
                    </View>
                    </BlurView>

                    <View style={styles.forgotContainer}>
                        <Text style={styles.forgotText}>Forgot Password?</Text>
                        </View>
                        <BlurView intensity={30} tint="light" style={{ borderRadius: 16, overflow: 'hidden' }}>
                            <Button label='Login' onPress={() => router.push('/home')}/>
                        </BlurView>
                    </View>

                    <View style={styles.dividerGroup}>
                        <View style={styles.divider}></View>
                        <Text style={styles.dividerText}>OR</Text>
                        <View style={styles.divider}></View>
                    </View>

                    <TouchableOpacity style={styles.socialButtonGroup}>
                        <BlurView intensity={16} tint="light" style={styles.socialButton}>
                            <Image source={require("@/assets/images/google.png")}/>
                            <Text style={styles.socialText}>Continue with google</Text>
                        </BlurView>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.socialButtonGroup}>
                        <BlurView intensity={16} tint="light" style={styles.socialButton}>
                            <Image source={require("@/assets/images/facebook.png")}/>
                            <Text style={styles.socialText}>Continue with Facebook</Text>
                        </BlurView>
                    </TouchableOpacity>

                    <View style={styles.signupContainer}>
                        <Text style={styles.signupText}>Don't Have an account?</Text>
                        <TouchableHighlight onPress={() => router.push('/registration')}>
                            <Text style={styles.joinNow}>Join now</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}