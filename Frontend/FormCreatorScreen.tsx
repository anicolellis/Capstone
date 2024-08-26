// FormCreatorScreen.tsx
import React, { useState } from 'react';
import { SafeAreaView, Text, TextInput, TouchableOpacity, View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { URL_BASE } from './Data/Urls';

export const FormCreatorScreen = () => {
  // Get the navigation object
  const navigation = useNavigation();

  // State variables
  const [formTitle, setFormTitle] = useState('');
  const [columns, setColumns] = useState([{ name: '', column_type: 'text', options: [] }]);

  // Handle form title change
  const handleFormTitleChange = (text) => {
    setFormTitle(text);
  };

  // Handle column name change
  const handleColumnNameChange = (index, text) => {
    const updatedColumns = [...columns];
    updatedColumns[index].name = text;
    setColumns(updatedColumns);
  };

  // Handle column type change
  const handleColumnTypeChange = (index, column_type) => {
    const updatedColumns = [...columns];
    updatedColumns[index].column_type = column_type;
    updatedColumns[index].options = []; // Clear options when changing column type
    setColumns(updatedColumns);
  };

  // Handle column option change
  const handleColumnOptionChange = (index, options) => {
    const updatedColumns = [...columns];
    updatedColumns[index].options = options.split(',').map((option) => option.trim());
    setColumns(updatedColumns);
  };

  // Handle add column button press
  const handleAddColumn = () => {
    setColumns([...columns, { name: '', column_type: 'text', options: [] }]);
  };

  // Handle create form button press
  const handleCreateForm = () => {
    // Create the new form based on the user input
    const newForm = {
      title: formTitle,
      columns: columns.map((column) => ({
        name: column.name,
        column_type: column.column_type,
        options: column.column_type === 'select' ? column.options : [],
      })),
    };

    // Send the new form data to the backend API
    fetch(`${URL_BASE}/forms/create/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newForm),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Form created successfully:', data);
        navigation.navigate('FormSelection');
      })
      .catch((error) => {
        console.error('Error creating form:', error);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.header}>Form Creator</Text>
        {/* Form title input */}
        <TextInput
          style={styles.input}
          placeholder="Form Title"
          value={formTitle}
          onChangeText={handleFormTitleChange}
        />
        {/* Render columns */}
        {columns.map((column, index) => (
          <View key={index} style={styles.columnContainer}>
            {/* Column name input */}
            <TextInput
              style={styles.input}
              placeholder={`Column ${index + 1} Name`}
              value={column.name}
              onChangeText={(text) => handleColumnNameChange(index, text)}
            />
            {/* Column type buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.typeButton, column.column_type === 'text' && styles.selectedTypeButton]}
                onPress={() => handleColumnTypeChange(index, 'text')}
              >
                <Text style={styles.typeButtonText}>Text</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.typeButton, column.column_type === 'number' && styles.selectedTypeButton]}
                onPress={() => handleColumnTypeChange(index, 'number')}
              >
                <Text style={styles.typeButtonText}>Number</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.typeButton, column.column_type === 'select' && styles.selectedTypeButton]}
                onPress={() => handleColumnTypeChange(index, 'select')}
              >
                <Text style={styles.typeButtonText}>Select</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.typeButton, column.column_type === 'radio' && styles.selectedTypeButton]}
                onPress={() => handleColumnTypeChange(index, 'radio')}
              >
                <Text style={styles.typeButtonText}>Radio</Text>
              </TouchableOpacity>
            </View>
            {/* Column options input for 'select' type */}
            {column.column_type === 'select' && (
              <TextInput
                style={styles.input}
                placeholder="Enter options (comma-separated)"
                value={column.options.join(', ')}
                onChangeText={(text) => handleColumnOptionChange(index, text)}
              />
            )}
          </View>
        ))}
        {/* Add column button */}
        <TouchableOpacity style={styles.button} onPress={handleAddColumn}>
          <Text style={styles.buttonText}>Add Column</Text>
        </TouchableOpacity>
        {/* Create form button */}
        <TouchableOpacity style={styles.button} onPress={handleCreateForm}>
          <Text style={styles.buttonText}>Create Form</Text>
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
    padding: 10,
  },
  scrollView: {
    marginHorizontal: 5,
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#3b3b3b',
    marginTop: 15,
    marginBottom: 25,
    textAlign: 'center',
  },
  input: {
    height: 50,
    width: '95%',
    marginVertical: 3,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
  },
  columnContainer: {
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  typeButton: {
    backgroundColor: '#a60a3d',
    padding: 10,
    borderRadius: 5,
  },
  selectedTypeButton: {
    backgroundColor: '#c0c0c0',
  },
  typeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#a60a3d',
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
