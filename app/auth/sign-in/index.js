import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native'; 
import { Colors } from '@/constants/Colors';
import { router } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './../../../configs/firebaseConfig';

export default function SignIn() {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useFocusEffect(
        React.useCallback(() => {
            navigation.setOptions({
                headerShown: false,
            });
            return () => {};
        }, [navigation])
    );

    const signin = () => {
        // Check if email or password is empty
        if (!email || !password) {
            alert("Please fill out all fields!");
            return;
        }

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log(user);
                
                alert("Login Successful!");
                router.replace('mytrip');
            })
            .catch((error) => {
                const errorCode = error.code;

                // Handle different error cases
                switch (errorCode) {
                    case 'auth/invalid-email':
                        alert("Invalid Email Format!");
                        break;
                    case 'auth/user-not-found':
                        alert("No user found with this email!");
                        break;
                    case 'auth/wrong-password':
                        alert("Incorrect Password!");
                        break;
                    case 'auth/too-many-requests':
                        alert("Too many login attempts. Please try again later.");
                        break;
                    default:
                        alert("Login Failed. Please try again.");
                }
            });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Let’s Sign in,</Text>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>E-mail</Text>
                <TextInput
                    placeholder="Enter the Email"
                    onChangeText={(value) => setEmail(value)}
                    style={styles.input}
                    keyboardType="email-address"
                    value={email}
                />
            </View>
            
            <View>
                <Text style={styles.label2}>Password</Text>
                <TextInput
                    placeholder="Enter the Password"
                    style={styles.input}
                    onChangeText={(value) => setPassword(value)}
                    secureTextEntry={true}
                    value={password}
                />
            </View>

            <View>
                <TouchableOpacity onPress={signin}>
                    <Text style={styles.button}>Sign in</Text>
                </TouchableOpacity>

                <View style={styles.signup}>
                    <Text style={{ fontFamily: 'outfit' }}>Don't have an account?</Text>
                    
                    <TouchableOpacity onPress={() => router.push('auth/sign-up')}>
                        <Text style={{ flex: 1, fontFamily: 'outfit-B' }}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 25,
        height: '100%',
        marginTop: 80,
        backgroundColor: '#fff',
    },
    title: {
        fontFamily: 'outfit-B',
        fontSize: 30,
        marginTop: 20,
    },
    inputContainer: {
        marginTop: 60,
        alignItems: 'flex-start',
        fontFamily: 'outfit-M',
    },
    label: {
        marginLeft: 12,
        fontFamily: 'outfit',
    },
    label2: {
        marginLeft: 12,
        marginTop: 35,
        fontFamily: 'outfit',
    },
    input: {
        borderWidth: 1,
        borderRadius: 20,
        padding: 15,
        width: '100%',
        fontFamily: 'outfit',
    },
    button: {
        marginTop: '15%',
        color: '#ECEDEE',
        backgroundColor: '#151718',
        fontSize: 14,
        fontWeight: '700',
        padding: 20,
        textAlign: 'center',
        borderRadius: 99,
    },
    signup: {
        marginTop: 2,
        alignItems: 'center',
    },
});
