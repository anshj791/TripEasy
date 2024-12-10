import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { router } from 'expo-router';
import { auth, db } from './../../../configs/firebaseConfig'; // Assuming you have Firestore initialized in FirebaseConfig
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';

export default function SignUp() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      navigation.setOptions({
        headerShown: false,
      });

      return () => {};
    }, [navigation])
  );

  const createAccount = async () => {
    // Field validation
    if (!email || !password || !fullName) {
      alert('Please enter all details correctly');
      return;
    }

    try {
      // Firebase authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Adding user data to Firestore
      await addDoc(collection(db, 'users'), {
        uid: user.uid,
        fullName: fullName,
        email: user.email,
      });

      alert('Account created successfully!');
      router.replace('mytrip'); // Navigate to mytrip page after successful registration
    } catch (error) {
      const errorCode = error.code;

      // Handle Firebase errors
      switch (errorCode) {
        case 'auth/invalid-email':
          alert('Invalid email format!');
          break;
        case 'auth/weak-password':
          alert('Password should be at least 6 characters!');
          break;
        case 'auth/email-already-in-use':
          alert('This email is already in use!');
          break;
        default:
          alert('Failed to create account. Please try again.');
      }

      console.error(error.message, errorCode);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>You Are New Here,</Text>

      <View>
        <Text style={styles.label3}>Full Name</Text>
        <TextInput
          placeholder="Enter The Full Name"
          onChangeText={(value) => setFullName(value)}
          style={styles.input}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>E-mail</Text>
        <TextInput
          placeholder="Enter the Email"
          style={styles.input}
          onChangeText={(value) => setEmail(value)}
          keyboardType="email-address"
        />
      </View>

      <View>
        <Text style={styles.label2}>Password</Text>
        <TextInput
          placeholder="Enter the Password"
          style={styles.input}
          onChangeText={(value) => setPassword(value)}
          secureTextEntry={true}
        />
      </View>

      <TouchableOpacity onPress={createAccount}>
        <Text style={styles.button}>Create Account</Text>
      </TouchableOpacity>

      <View style={styles.signup}>
        <Text style={{ fontFamily: 'outfit' }}>Already have an Account?</Text>
        
        <TouchableOpacity onPress={() => router.push('auth/sign-in')}>
          <Text style={{ flex: 1, fontFamily: 'outfit-B' }}>Sign in</Text>
        </TouchableOpacity>
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
    marginTop: 35,
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
  label3: {
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
