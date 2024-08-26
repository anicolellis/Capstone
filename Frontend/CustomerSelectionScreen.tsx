// CustomerSelectionScreen.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './App';

export const CustomerSelectionScreen = () => {
  // Get the navigation object
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // Handle selecting an existing customer
  const handleSelectExistingCustomer = () => {
    // Logic for selecting an existing customer
    console.log('Existing customer selected');
    // Navigate to existing customer screen or perform action
    navigation.navigate('CustomerSignIn2');
  };

  // Handle selecting a new customer
  const handleSelectNewCustomer = () => {
    // Logic for creating or selecting a new customer
    console.log('New customer selected');
    // Navigate to new customer creation screen or perform action
    navigation.navigate('CustomerSignUp');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Please Select Customer Type</Text>

      {/* Existing customer button */}
      <TouchableOpacity onPress={handleSelectExistingCustomer} style={styles.button}>
        <Text style={styles.buttonText}>Existing</Text>
      </TouchableOpacity>

      {/* New customer button */}
      <TouchableOpacity onPress={handleSelectNewCustomer} style={styles.button}>
        <Text style={styles.buttonText}>New</Text>
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
    fontSize: 24,
    color: '#3b3b3b',
    marginBottom: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3b3b3b',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#a60a3d',
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
    width: '60%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
