import { styles } from "@/styles/_login";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from 'expo-blur';
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Image, Text, TextInput, TouchableHighlight, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Button from '../components/common/Button';
import { AuthService } from '../services/authService';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        if (!username || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }
        
        setIsLoading(true);
        
        try {
            // Timeout to prevent slowness/lagging
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000)

            const response = await fetch('https://social-media-project-9u8u.onrender.com/graphql/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                signal: controller.signal,

                body: JSON.stringify({
                    query: `
                        mutation LoginUser($username: String!, $password: String!) {
                        loginUser(username: $username, password: $password) {
                            token
                            user{
                                id
                                username
                                email
                                firstName
                                lastName
                            }
                        }
                    }
                    `,
                    variables: {
                        username: username.trim(),
                        password: password,
                    }
                })
            });

            clearTimeout(timeoutId);

            const data = await response.json();
            console.log('Login response:', JSON.stringify(data, null, 2));

            if (response.ok && data.data && data.data.loginUser) {
                // Centralized token + user storage
                await AuthService.handleLoginSuccess(data);
                // Optional: debug storage state
                await AuthService.debugStorage();

                Alert.alert('Success', 'Login successful!');
                router.push('/(home)/home');
            } else if (data.errors) {
                const errorMessage = data.errors[0]?.message || 'Invalid credentials';
                console.log('GraphQL errors:', data.errors);
                Alert.alert('Error', errorMessage);
            } else {
                Alert.alert('Error', 'Invalid response from server');
                console.log('Unexpected response format:', data);
            }
             
        } catch (error) {
            console.error('Login error:', error);
            Alert.alert('Error', 'Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            router.push('/(home)/home')
            // Implement Google authentication
            //Alert.alert('Google login pressed');
        } catch (error) {
            Alert.alert('Error', 'Google login failed');
        }
    };

    const handleFacebookLogin = async () => {
        try {
            // Implement Facebook authentication
            Alert.alert('Facebook login pressed');
        } catch (error) {
            Alert.alert('Error', 'Facebook login failed');
        }
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <View>
                    <View>
                        <Text style={styles.title}>Welcome back!</Text>
                        <Text style={styles.subtitle}>To sharing great moments</Text>
                    </View>
                    <View>
                        <Text style={styles.label}>Username or Email</Text>
                        <BlurView intensity={30} tint="light" style={{ borderRadius: 16, overflow: 'hidden' }}>
                            <TextInput 
                                placeholder="Username or email" 
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
                            <Button label='Login' onPress={handleLogin} />
                        </BlurView>
                    </View>

                    <View style={styles.dividerGroup}>
                        <View style={styles.divider}></View>
                        <Text style={styles.dividerText}>OR</Text>
                        <View style={styles.divider}></View>
                    </View>

                    <TouchableOpacity style={styles.socialButtonGroup} onPress={handleGoogleLogin}>
                        <BlurView intensity={16} tint="light" style={styles.socialButton}>
                            <Image source={require("@/assets/images/google.png")}/>
                            <Text style={styles.socialText}>Continue with google</Text>
                        </BlurView>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.socialButtonGroup} onPress={handleFacebookLogin}>
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
    );
}