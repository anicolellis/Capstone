import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { URL_BASE } from './Data/Urls';

export const CustomerSignUpScreen = () => {
  // Get the navigation object
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // State variables for customer details
  const [farm, setFarm] = useState('');
  const [first, setFirst] = useState('');
  const [last, setLast] = useState('');
  const [num, setNum] = useState('');
  const [street, setStreet] = useState('');
  const [zip, setZip] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');

  const handleSignUp = async () => {
    // Create an object with the customer details
    const data = {
      farm,
      first,
      last,
      num,
      street,
      zip,
      city,
      country,
    };

    try {
      // Send a POST request to the server with the customer details
      const response = await fetch(`${URL_BASE}/customer-info/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        // Navigate to the CustomerSignIn2 screen if the sign-up is successful
        navigation.navigate('CustomerSignIn2');
      } else {
        // Parse the error data from the response
        const errorData = await response.json();
        alert(`Sign up failed. ${errorData.message || 'Please check your details.'}`);
      }
    } catch (error) {
      console.error('Sign up error:', error);
      alert('An error occurred during sign up. Please try again later.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Customer Sign Up</Text>

      {/* Input fields for customer details */}
      <TextInput style={styles.input} onChangeText={setFarm} value={farm} placeholder="Farm" />
      <TextInput style={styles.input} onChangeText={setFirst} value={first} placeholder="First Name" />
      <TextInput style={styles.input} onChangeText={setLast} value={last} placeholder="Last Name" />
      <TextInput style={styles.input} onChangeText={setNum} value={num} placeholder="Number" />
      <TextInput style={styles.input} onChangeText={setStreet} value={street} placeholder="Street" />
      <TextInput style={styles.input} onChangeText={setZip} value={zip} placeholder="Zip Code" />
      <TextInput style={styles.input} onChangeText={setCity} value={city} placeholder="City" />
      <TextInput style={styles.input} onChangeText={setCountry} value={country} placeholder="Country" />

      {/* Sign Up button */}
      <TouchableOpacity onPress={handleSignUp} style={styles.submitButton}>
        <Text style={styles.submitButtonText}>Sign Up</Text>
      </TouchableOpacity>

      {/* Back button */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.submitButton}>
        <Text style={styles.submitButtonText}>Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// Styles for the components
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
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
