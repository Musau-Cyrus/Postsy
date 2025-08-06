import{ View, Text, TextInput, TouchableOpacity, Image, Alert, TouchableHighlight } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { styles } from "@/styles/_login";
import Button from '../components/common/Button';
import { BlurView } from 'expo-blur';
import { useState } from "react";
import { router } from "expo-router";
import { useMutation } from "@apollo/client";
import { REGISTER_USER, GOOGLE_AUTH, FACEBOOK_AUTH } from "@/lib/authQueries";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Registration (){
    const [ firstName, setFirstName ] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false)

    const [registerUser, { loading: registerLoading }] = useMutation(REGISTER_USER);
    const [googleAuth] = useMutation(GOOGLE_AUTH);
    const [facebookAuth] = useMutation(FACEBOOK_AUTH);

    const handleRegistration = async () => {
    if (!firstName || !lastName || !email || !username || !password || !confirmPassword) {
        Alert.alert('Error', 'Please fill all required fields!');
        return;
    }
    if (password !== confirmPassword) {
        Alert.alert('Error', 'Password mismatch!');
        return;
    }
    try {
        console.log('=== DEBUG INFO ===');
        console.log('REGISTER_USER mutation:', REGISTER_USER.loc?.source?.body);
        console.log('Variables being sent:', {
            firstName: firstName,
            lastName: lastName,
            email: email,
            username: username,
            password: password
        });
        console.log('=================');

        const { data } = await registerUser({
            variables: {
                firstName: firstName,
                lastName: lastName,
                email: email,
                username: username,
                password: password
            }
        });

        if (data?.registerUser?.token) {
            await AsyncStorage.setItem('authToken', data.registerUser.token);
            Alert.alert('Success', 'Registration successful!');
            router.push('/login');
        }
    } catch (error: any) {
        console.log('Full error:', JSON.stringify(error, null, 2));
        Alert.alert('Error', error.message || 'Registration failed!');
    }
};
const handleGoogleLogin = async () => {
    try {
        // Implement Google authentication
        Alert.alert('Google login pressed');
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
                        <Text style={styles.title}>Welcome to</Text>
                        <Text style={styles.subtitle}>Postsy</Text> {/*Placeholder text for Name */}
                    </View>
                    <View>
                        <Text style={styles.label}>First Name</Text>
                        <BlurView intensity={30} tint="light" style={{ borderRadius: 16, overflow: 'hidden' }}>
                            <TextInput 
                            placeholder="Enter firstname" 
                            placeholderTextColor={'#ccc'} 
                            style={styles.input} 
                            value={firstName} 
                            onChangeText={setFirstName}/>
                        </BlurView>
                        <Text style={styles.label}>Last Name</Text>
                        <BlurView intensity={30} tint="light" style={{ borderRadius: 16, overflow: 'hidden' }}>
                            <TextInput 
                            placeholder="Enter Last Name" 
                            placeholderTextColor={'#ccc'} 
                            style={styles.input} 
                            value={lastName} 
                            onChangeText={setLastName}/>
                        </BlurView>
                        <Text style={styles.label}>Email</Text>
                        <BlurView intensity={30} tint="light" style={{ borderRadius: 16, overflow: 'hidden' }}>
                            <TextInput 
                            placeholder="Enter email example@gmail.com" 
                            placeholderTextColor={'#ccc'} 
                            style={styles.input} 
                            value={email} 
                            onChangeText={setEmail}/>
                        </BlurView>
                        <Text style={styles.label}>Username</Text>
                        <BlurView intensity={30} tint="light" style={{ borderRadius: 16, overflow: 'hidden' }}>
                            <TextInput 
                            placeholder="Enter username" 
                            placeholderTextColor={'#ccc'} 
                            style={styles.input} 
                            value={username} 
                            onChangeText={setUsername}/>
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

                    {/*Confirm Password*/}
                    <Text style={styles.label}>Confirm Password</Text>
                    <BlurView intensity={30} tint="light" style={{ borderRadius: 16, overflow: 'hidden' }}>
                      <View style={styles.passwordContainer}>
                        
                        <TextInput
                        style={{flex: 1, paddingVertical: 12, color: 'white'}}
                        placeholder="Confirm Password"
                        placeholderTextColor="#ccc"
                        value={confirmPassword}
                        secureTextEntry={!isConfirmPasswordVisible}
                        onChangeText={setConfirmPassword}
                        />
                        <TouchableOpacity
                            onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                        >
                        <Ionicons
                            name={isConfirmPasswordVisible ? 'eye' : 'eye-off'}
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
                            <Button 
                            label={registerLoading ? 'Registering' : 'Register Account'} onPress={handleRegistration}/>
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
                        <Text style={styles.signupText}>Already Have an account?</Text>
                        <TouchableHighlight onPress={() => router.push('/login')}>
                            <Text style={styles.joinNow}>Log in</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}