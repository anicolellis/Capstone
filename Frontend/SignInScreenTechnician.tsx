import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from './App';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { URL_BASE } from './Data/Urls';
import EncryptedStorage from 'react-native-encrypted-storage';

export const SignInScreenTechnician = () => {
  // Get the navigation object
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'SignIn'>>();

  // State variables for username/email and password
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    // Create an object with the login data
    const data = {
      username: usernameOrEmail,
      password: password,
    };

    try {
      // Send a POST request to the server for authentication
      const response = await fetch(`${URL_BASE}/api-token-auth/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        // Extract the token from the response
        const { token } = await response.json();
        console.log('Authentication Token:', token);

        // Create an object with the token and username to be stored
        const items = {
          token: token.toString(),
          username: usernameOrEmail,
        };

        // Convert the object to an array of key-value pairs
        const itemsArray = Object.entries(items);

        // Function to store multiple items in AsyncStorage
        const storeMultipleItems = async (itemsArray) => {
          try {
            await AsyncStorage.multiSet(itemsArray);
          } catch (e) {
            console.error('Error storing items', e);
          }
        };

        // Store the username in AsyncStorage
        await storeMultipleItems([
          ['username', usernameOrEmail],
        ]);

        // Store the token securely using EncryptedStorage
        await EncryptedStorage.setItem("token", token.toString());

        // Navigate to the ProjectSelection screen
        navigation.navigate('ProjectSelection');
      } else {
        // Show an alert if the login fails
        alert('Login failed. Please check your username and password.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome back!</Text>
      <Text style={styles.title}>Technician Login</Text>

      {/* Input field for username or email */}
      <TextInput
        style={styles.input}
        onChangeText={setUsernameOrEmail}
        value={usernameOrEmail}
        placeholder="Username or email address"
        autoCapitalize="none"
      />

      {/* Input field for password */}
      <TextInput
        style={styles.input}
        onChangeText={setPassword}
        value={password}
        placeholder="Password"
        secureTextEntry
      />

      {/* Submit button */}
      <TouchableOpacity onPress={handleSignIn} style={styles.submitButton}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

// Styles for the components
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    fontSize: 16,
    color: '#3b3b3b',
    marginBottom: 5,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#3b3b3b',
    marginBottom: 30,
  },
  input: {
    height: 50,
    width: '90%',
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#a60a3d',
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
    width: '50%',
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
