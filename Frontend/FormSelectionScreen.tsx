// FormSelectionScreen.tsx
import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { URL_BASE } from './Data/Urls';

export const FormSelectionScreen = () => {
  // Get the navigation object and isFocused hook from react-navigation
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  // State variables
  const [selectedForm, setSelectedForm] = useState(null);
  const [formNames, setFormNames] = useState([]);
  const [customerForms, setCustomerForms] = useState([]);
  const [remaining, setRemaining] = useState<Array<number>>([]);

  useEffect(() => {
    // Fetch form names from the server
    const fetchFormNames = async () => {
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

        // Send a POST request to fetch customer form names
        const response = await fetch(`${URL_BASE}/customer-sign-in/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(request),
        });

        if (!response.ok) {
          console.error('Failed to fetch customer form names');
          return;
        }

        // Parse the response data and extract customer form names and remaining forms
        const customerData = await response.json();
        const installations = customerData.installations.split(',').map((inst) => inst.trim());
        const customerFormNames = [];
        const remainingForms = [];

        if (installations[0] !== '0') {
          customerFormNames.push('Astronaut');
          remainingForms.push(customerData.remaining1);
        }
        if (installations[1] !== '0') {
          customerFormNames.push('Vector');
          remainingForms.push(customerData.remaining2);
        }
        if (installations[2] !== '0') {
          customerFormNames.push('Horizon');
          remainingForms.push(customerData.remaining3);
        }

        setCustomerForms(customerFormNames);
        setRemaining(remainingForms);

        // Fetch all form names from the server
        const formsResponse = await fetch(`${URL_BASE}/forms/`);

        if (!formsResponse.ok) {
          console.error('Failed to fetch form names');
          return;
        }

        // Parse the response data and extract form titles
        const formsData = await formsResponse.json();
        const formTitles = formsData.map((form) => form.title);

        // Combine customer form names and form titles
        const allFormNames = [...customerFormNames, ...formTitles];
        setFormNames(allFormNames);
        setRemaining([...remainingForms, '1']);
      } catch (error) {
        console.error('Error fetching form names:', error);
      }
    };

    // Fetch form names when the screen is focused
    fetchFormNames();
  }, [isFocused]);

  // Handle create form button press
  const handleCreateForm = () => {
    navigation.navigate('FormCreator');
  };

  // Handle continue button press
  const handleContinue = () => {
    console.log('Selected form: ', selectedForm);

    // Navigate to the corresponding form screen based on the selected form
    switch (selectedForm) {
      case 'Vector':
        if (remaining[1] > 0) {
          navigation.navigate('VectorForm');
        }
        break;
      case 'Astronaut':
        if (remaining[0] > 0) {
          navigation.navigate('AstronautForm');
        }
        break;
      case 'Horizon':
        if (remaining[2] > 0) {
          navigation.navigate('HorizonForm');
        }
        break;
      default:
        navigation.navigate('DynamicForm', { formName: selectedForm });
        break;
    }
  };

  return (
    <SafeAreaView style={styles.formsContainer}>
      <Text style={styles.formsHeader}>Forms</Text>
      <Text style={styles.formsSubHeader}>Select the form you would like to fill out</Text>
      {/* Create form button */}
      <TouchableOpacity style={styles.createFormButton} onPress={handleCreateForm}>
        <Text style={styles.createFormIcon}>+</Text>
      </TouchableOpacity>
      {/* Scrollable list of forms */}
      <ScrollView style={styles.formsList}>
        {formNames.map((formName, idx) => (
          <TouchableOpacity
            key={formName}
            style={[styles.formItem, selectedForm === formName && styles.formItemSelected]}
            onPress={() => setSelectedForm(formName)}
          >
            <Text style={[styles.formItemText, selectedForm === formName && styles.formItemSelectedText]}>
              {formName} ({remaining[idx]} remaining)
            </Text>
            {!customerForms.includes(formName) && (
              <Text style={styles.customerFormLabel}>Custom Form</Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
      {/* Continue button */}
      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueButtonText}>Continue →</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

// Styles for the components
const styles = StyleSheet.create({
  formsContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  formsHeader: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#3b3b3b',
    marginBottom: 10,
    marginTop: 30,
  },
  formsSubHeader: {
    fontSize: 16,
    color: '#3b3b3b',
    marginBottom: 20,
  },
  formsList: {
    width: '100%',
  },
  formItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    width: '100%',
  },
  customerFormLabel: {
    marginLeft: 10,
    fontSize: 14,
    color: '#888',
  },
  formItemSelected: {
    borderLeftWidth: 5,
    borderColor: '#a60a3d',
    backgroundColor: '#f8f8f8',
  },
  formItemText: {
    fontSize: 18,
    color: '#3b3b3b',
  },
  formItemSelectedText: {
    fontWeight: 'bold',
    color: '#a60a3d',
  },
  continueButton: {
    backgroundColor: '#a60a3d',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    position: 'absolute',
    bottom: 20,
    width: '90%',
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  createFormButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#a60a3d',
    borderRadius: 25,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createFormIcon: {
    width: 24,
    height: 24,
  },
  createFormIcon: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 25,
    lineHeight: 40,
  },
});
