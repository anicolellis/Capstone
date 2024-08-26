import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './App';

export const ProjectSelectionScreen = () => {
  // Get the navigation object
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // State variables
  const [selectedProject, setSelectedProject] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Array of existing projects
  const projects = ['Project 1', 'Project 2', 'Project 3'];

  // Handle selecting an existing project
  const handleSelectProject = () => {
    if (selectedProject) {
      navigation.navigate('CustomerSignIn');
    }
  };

  // Handle selecting a new project
  const handleSelectNew = () => {
    // Logic for creating or selecting a new project
    console.log('New project selected');
    navigation.navigate('CustomerSelection');
    // Navigate to new project creation screen or perform action
    // navigation.navigate('NewProject');
  };

  // Toggle the dropdown menu
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Select a project from the dropdown menu
  const selectProject = (project: string) => {
    setSelectedProject(project);
    setIsDropdownOpen(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Please Select a Project</Text>
      <Text style={styles.label}>Existing</Text>

      {/* Dropdown container */}
      <Pressable style={styles.dropdownContainer} onPress={toggleDropdown}>
        <Text style={styles.dropdownText}>{selectedProject || 'Select a project'}</Text>
      </Pressable>

      {/* Dropdown options */}
      {isDropdownOpen && (
        <View style={styles.dropdownOptions}>
          {projects.map((project) => (
            <Pressable
              key={project}
              style={styles.dropdownOption}
              onPress={() => selectProject(project)}
            >
              <Text style={styles.dropdownOptionText}>{project}</Text>
            </Pressable>
          ))}
        </View>
      )}

      {/* Select button */}
      <TouchableOpacity
        onPress={handleSelectProject}
        style={[styles.button, { marginTop: 20 }]}
        disabled={!selectedProject}
      >
        <Text style={styles.buttonText}>Select</Text>
      </TouchableOpacity>

      {/* New button */}
      <TouchableOpacity onPress={handleSelectNew} style={[styles.button, { marginTop: 10 }]}>
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
  label: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#a60a3d',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: '60%',
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownOptions: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    width: '60%',
    marginBottom: 10,
  },
  dropdownOption: {
    padding: 10,
  },
  dropdownOptionText: {
    fontSize: 16,
    color: '#333',
  },
});
