import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, SafeAreaView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from './App'; // Adjust the path as necessary
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { URL_BASE } from './Data/Urls';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const DynamicFormScreen = () => {
  // Get the navigation object and route parameters
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const { formName } = route.params as { formName: string };

  // State variables
  const [formData, setFormData] = useState<any>(null);
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    // Fetch form data from the server
    const fetchFormData = async () => {
      try {
        // Get customer details from AsyncStorage
        const keys = ['customerLastName', 'customerNumber'];
        const result = await AsyncStorage.multiGet(keys);
        const items = Object.fromEntries(result);
        const { customerLastName, customerNumber } = items;

        // Fetch form data from the server
        const response = await fetch(`${URL_BASE}/forms/`);

        if (!response.ok) {
          console.error('Failed to fetch form data');
          return;
        }

        const data = await response.json();
        const selectedForm = data.find((form: any) => form.title === formName);
        setFormData(selectedForm);

        // Fetch form data for the customer
        const formDataResponse = await fetch(`${URL_BASE}/forms/get-data/${formName}/${customerLastName}/${customerNumber}/`);

        if (formDataResponse.ok) {
          const formData = await formDataResponse.json();
          setRows(formData.data);
        } else {
          setRows([{}]); // Initialize with one empty row if form data doesn't exist
        }
      } catch (error) {
        console.error('Error fetching form data:', error);
      }
    };

    fetchFormData();
  }, [formName]);

  // Handle input change for text and number fields
  const handleInputChange = (rowIndex: number, columnName: string, value: string) => {
    const updatedRows = [...rows];
    updatedRows[rowIndex][columnName] = value;
    setRows(updatedRows);
  };

  // Handle select option change
  const handleSelectChange = (rowIndex: number, columnName: string, value: string) => {
    const updatedRows = [...rows];
    updatedRows[rowIndex][columnName] = value;
    setRows(updatedRows);
  };

  // Handle radio button toggle
  const handleRadioToggle = (rowIndex: number, columnName: string) => {
    const updatedRows = [...rows];
    updatedRows[rowIndex][columnName] = !updatedRows[rowIndex][columnName];
    setRows(updatedRows);
  };

  // Handle add row button press
  const handleAddRow = () => {
    setRows([...rows, {}]);
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      // Get customer details from AsyncStorage
      const keys = ['customerLastName', 'customerNumber'];
      const result = await AsyncStorage.multiGet(keys);
      const items = Object.fromEntries(result);
      const { customerLastName, customerNumber } = items;

      // Send form data to the server
      const response = await fetch(`${URL_BASE}/forms/save-data/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ formName, customerLastName, customerNumber, rows }),
      });
      
      // Navigate back to the FormSelection screen
      navigation.navigate("FormSelection");
    } catch (error) {
      console.error('Error submitting form data:', error);
    }
  };

  // Render loading state if form data is not available
  if (!formData) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.header}>{formData.title}</Text>
        
        {/* Render form rows */}
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {/* Render form columns */}
            {formData.columns?.map((column: any) => (
              <View key={column.name} style={styles.inputContainer}>
                <Text style={styles.columnName}>{column.name}</Text>
                
                {/* Render input fields based on column type */}
                {column.column_type === 'text' && (
                  <TextInput
                    style={styles.input}
                    placeholder={column.column_type}
                    value={row[column.name]}
                    onChangeText={(value) => handleInputChange(rowIndex, column.name, value)}
                  />
                )}
                {column.column_type === 'number' && (
                  <TextInput
                    style={styles.input}
                    placeholder={column.column_type}
                    value={row[column.name]}
                    onChangeText={(value) => handleInputChange(rowIndex, column.name, value)}
                    keyboardType="numeric"
                  />
                )}
                
                {/* Render select options */}
                {column.column_type === 'select' && (
                  <View style={styles.selectContainer}>
                    {column.options.map((option: string) => (
                      <TouchableOpacity
                        key={option}
                        style={[
                          styles.selectOption,
                          row[column.name] === option && styles.selectedOption,
                        ]}
                        onPress={() => handleSelectChange(rowIndex, column.name, option)}
                      >
                        <Text style={styles.selectOptionText}>{option}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
                
                {/* Render radio button */}
                {column.column_type === 'radio' && (
                  <View style={styles.radioButtonContainer}>
                    <TouchableOpacity
                      style={[styles.radioButton, row[column.name] && styles.selectedRadioButton]}
                      onPress={() => handleRadioToggle(rowIndex, column.name)}
                    >
                      <Text style={styles.radioButtonText}>{column.name}</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))}
            
            {/* Render separator between rows */}
            {rowIndex < rows.length - 1 && <View style={styles.separator} />}
          </View>
        ))}
        
        {/* Render add row button */}
        <TouchableOpacity onPress={handleAddRow} style={styles.addButton}>
          <Text style={styles.addButtonText}>Add Row</Text>
        </TouchableOpacity>
        
        {/* Render submit button */}
        <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

// Styles for the components
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3b3b3b',
    marginBottom: 20,
    textAlign: 'center', 
  },
  row: {
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 10,
  },
  columnName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 10,
    borderRadius: 5,
    fontSize: 16,
  },
  selectContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  selectOption: {
    backgroundColor: '#ddd',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginRight: 10,
    marginBottom: 10,
  },
  selectedOption: {
    backgroundColor: '#a60a3d',
  },
  selectOptionText: {
    fontSize: 16,
    color: '#3b3b3b',
  },
  radioButtonContainer: {
    alignSelf: 'flex-start',
    marginTop: 5,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    backgroundColor: '#ddd',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  selectedRadioButton: {
    backgroundColor: '#a60a3d',
  },
  radioButtonText: {
    fontSize: 16,
    color: '#3b3b3b',
  },
  separator: {
    height: 1,
    backgroundColor: '#888',
    marginTop: 10,
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#a60a3d',
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  submitButton: {
    backgroundColor: '#a60a3d',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
