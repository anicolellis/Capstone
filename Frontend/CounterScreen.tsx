import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { URL_BASE } from './Data/Urls';

export const CounterScreen = () => {
  // Get the navigation object
  const navigation = useNavigation();

  // State variables for counters
  const [counters, setCounters] = useState({ astronaut: 0, vector: 0, horizon: 0 });

  useEffect(() => {
    // Fetch installation data from the server
    const fetchInstallationData = async () => {
      try {
        // Get customer details from AsyncStorage
        const keys = ['customerLastName', 'customerNumber'];
        const result = await AsyncStorage.multiGet(keys);
        const items = Object.fromEntries(result);
        const { customerLastName, customerNumber } = items;

        if (!customerLastName || !customerNumber) {
          console.error('No customer found');
          return;
        }

        // Create a request object with customer details
        const request = {
          last: customerLastName,
          num: customerNumber,
        };

        // Send a POST request to the server to fetch installation data
        const response = await fetch(`${URL_BASE}/customer-sign-in/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(request),
        });

        if (!response.ok) {
          console.error('Failed to fetch form names');
          return;
        }

        // Parse the response data and update the counters state
        const data = await response.json();
        const installations = data.installations.split(',').map(Number);
        setCounters({
          astronaut: installations[0],
          vector: installations[1],
          horizon: installations[2],
        });
      } catch (error) {
        console.error('Error fetching installations:', error);
      }
    };

    // Call the fetchInstallationData function when the component mounts
    fetchInstallationData();
  }, []);

  // Function to increment the counter for a specific machine
  const increment = (machine) => {
    setCounters((prevState) => ({ ...prevState, [machine]: prevState[machine] + 1 }));
  };

  // Function to decrement the counter for a specific machine
  const decrement = (machine) => {
    setCounters((prevState) => ({ ...prevState, [machine]: Math.max(0, prevState[machine] - 1) }));
  };

  // Function to handle the "Next" button press
  const handleNext = async () => {
    try {
      // Get customer details from AsyncStorage
      const keys = ['customerLastName', 'customerNumber'];
      const result = await AsyncStorage.multiGet(keys);
      const items = Object.fromEntries(result);
      const customerLastName = items.customerLastName;
      const customerNumber = items.customerNumber;

      if (!customerLastName || !customerNumber) {
        console.error('Missing required data');
        return;
      }

      // Create an object with updated installation data
      const updateData = {
        last: customerLastName,
        num: customerNumber,
        installations: `${counters.astronaut}, ${counters.vector}, ${counters.horizon}`,
        remaining1: parseInt(`${counters.astronaut}`),
        remaining2: parseInt(`${counters.vector}`),
        remaining3: parseInt(`${counters.horizon}`),
      };

      // Send a POST request to update the installation data on the server
      const updateResponse = await fetch(`${URL_BASE}/customer-info/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (updateResponse.ok) {
        console.log('Installations updated successfully');
        // Navigate to the FormSelection screen
        navigation.navigate('FormSelection');
      } else {
        console.error('Failed to update installations');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Installations</Text>

      {/* Render counters for each machine */}
      {Object.entries(counters).map(([machine, count]) => (
        <View key={machine} style={styles.counterContainer}>
          <Text style={styles.machineTitle}>{machine.charAt(0).toUpperCase() + machine.slice(1)}</Text>
          <View style={styles.counterControls}>
            <TouchableOpacity onPress={() => decrement(machine)} style={styles.button}>
              <Text style={styles.buttonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.count}>{count}</Text>
            <TouchableOpacity onPress={() => increment(machine)} style={styles.button}>
              <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      {/* "Next" button */}
      <TouchableOpacity onPress={handleNext} style={styles.submitButton}>
        <Text style={styles.submitButtonText}>Next</Text>
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
    backgroundColor: '#fff', // Match the sign-in page background color
    padding: 20,
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 30, // Adjusted for visual separation
    color: '#3b3b3b', // Similar to sign-in page styles
  },
  counterContainer: {
    marginBottom: 20,
  },
  machineTitle: {
    fontSize: 22,
    fontWeight: 'normal',
    textAlign: 'center',
    marginBottom: 10,
  },
  counterControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#3498db',
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
  },
  count: {
    fontSize: 20,
  },
  submitButton: {
    backgroundColor: '#a60a3d',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    width: '50%',
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
