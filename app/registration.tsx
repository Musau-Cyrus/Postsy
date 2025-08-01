import{ View, Text, TextInput, TouchableOpacity, Image, Alert, TouchableHighlight } from "react-native";
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
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false)

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <View>
                    <View>
                        <Text style={styles.title}>Welcome to</Text>
                        <Text style={styles.subtitle}>Postsy</Text> {/*Placeholder text for Name */}
                    </View>
                    <View>
                        <Text style={styles.label}>Username</Text>
                        <BlurView intensity={30} tint="light" style={{ borderRadius: 16, overflow: 'hidden' }}>
                            <TextInput placeholder="Enter username" placeholderTextColor={'#ccc'} style={styles.input}/>
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
                        placeholder=" Password"
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
                            <Button label='Register Account' onPress={() => Alert.alert('Welcome to Postsy!')}/>
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