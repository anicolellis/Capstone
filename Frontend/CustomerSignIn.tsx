import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from './App';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { URL_BASE } from './Data/Urls';

export const CustomerSignIn = () => {
  // Get the navigation object
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'CustomerSignIn'>>();

  // State variables for customer last name and number
  const [lastName, setLastName] = useState('');
  const [customerNumber, setCustomerNumber] = useState('');

  const handleSubmit = async () => {
    // Create an object with the customer data
    const data = {
      last: lastName,
      num: customerNumber,
    };

    try {
      // Send a POST request to the server with the customer data
      const response = await fetch(`${URL_BASE}/customer-sign-in/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        // Create an object with the customer data to be stored
        const items = {
          customerLastName: lastName,
          customerNumber: customerNumber,
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

        // Store the customer data in AsyncStorage
        await storeMultipleItems([
          ['customerLastName', lastName],
          ['customerNumber', customerNumber],
        ]);

        // Navigate to the FormSelection screen
        navigation.navigate('FormSelection');
      } else {
        // Show an alert if the submission fails
        alert('Submission failed. Please check your customer name and ID.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Please add Customer Details</Text>
      
      {/* Input field for customer last name */}
      <TextInput
        style={styles.input}
        onChangeText={setLastName}
        value={lastName}
        placeholder="Customer Last Name"
      />

      {/* Input field for customer number */}
      <TextInput
        style={styles.input}
        onChangeText={setCustomerNumber}
        value={customerNumber}
        placeholder="Customer Number"
      />

      {/* Submit button */}
      <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>

      {/* Skip button */}
      <TouchableOpacity onPress={() => navigation.navigate('Counter')} style={styles.submitButton}>
        <Text style={styles.submitButtonText}>Skip</Text>
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
    fontSize: 24,
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
