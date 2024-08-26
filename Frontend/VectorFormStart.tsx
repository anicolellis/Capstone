import React, { useState, useEffect } from 'react';
import { Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from './App';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { URL_BASE } from './Data/Urls'
import EncryptedStorage from 'react-native-encrypted-storage';

/*
Vector form: First page
Author: Alex Nicolellis

The starting page for the Vector form. It contains text entries for customer and Lely information.
Similar to Astronaut page 1.
*/

export const VectorFormStart = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [cust_farm, setFarm] = useState('');
  const [cust_first, setFirst] = useState('');
  const [cust_last, setLast] = useState('');
  const [cust_num, setCustNum] = useState('');
  const [cust_street, setStreet] = useState('');
  const [cust_ZIP, setZIP] = useState('');
  const [cust_city, setCity] = useState('');
  const [cust_country, setCountry] = useState('');
  const [lely_num, setLelyNum] = useState('');
  const [lely_name, setLelyName] = useState('');
  const [lely_area, setArea] = useState('');
  const [lely_coordinatorname, setCoordinatorName] = useState('');
  const [installation_co, setCompany] = useState('');

  const nextPage = () => {
    navigation.navigate("VectorForm2", {
      farm: cust_farm,
      first: cust_first,
      last: cust_last,
      num: cust_num,
      street: cust_street,
      zip: cust_ZIP,
      city: cust_city,
      country: cust_country,
      lelynum: lely_num,
      lelyname: lely_name,
      lelyarea: lely_area,
      coordname: lely_coordinatorname,
      installco: installation_co
    });
  };

  useEffect(() =>{
      const fetchUserData = async() => {
          try {
              const keys = ['username', 'customerNumber', 'customerLastName']; 
              const result = await AsyncStorage.multiGet(keys);
              const items = Object.fromEntries(result);
              const token = await EncryptedStorage.getItem("token");
              const username = items.username;
              const lastName = items.customerLastName;
              const custNum = items.customerNumber;
      
              if (!token || !username) {
                console.error('No token or username found');
                return;
              }

              if (!lastName || !custNum) {
                console.error('Customer info not found');
                return;
              }
      
              const response = await fetch(`${URL_BASE}/customerInfo/${lastName}/${custNum}/`, {
                method: 'GET',
                headers: {
                  'Authorization': `Token ${token}`,
                  'Content-Type': 'application/json',
                },
              });
      
              if (!response.ok) {
                console.log('Failed to fetch user info');
                return;
              }
      
              const data = await response.json();
              console.log('Got customer info: ', data);
              setFarm(data.farm);
              setFirst(data.first);
              setLast(data.last);
              setCustNum(data.num);
              setStreet(data.street);
              setZIP(data.zip);
              setCity(data.city);
              setCountry(data.country);
            } catch (error) {
              console.error('Failed to fetch user info:', error);
          }
      };
      fetchUserData();
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
      <Text style={styles.header}>Handover Declaration Vector: Declaration of Installation</Text>
      <Text style={styles.subsection}> Customer/Buyer</Text>
      <TextInput style={styles.input} onChangeText={setFarm} value={cust_farm}
        placeholder="Farm Name" />
      <TextInput style={styles.input} onChangeText={setFirst} value={cust_first}
        placeholder="First Name" />
      <TextInput style={styles.input} onChangeText={setLast} value={cust_last}
        placeholder="Last Name" />
      <TextInput style={styles.input} onChangeText={setCustNum} value={cust_num}
        placeholder="Customer No. (Lely/Movex)" />
      <TextInput style={styles.input} onChangeText={setStreet} value={cust_street}
        placeholder="Street" />
      <TextInput style={styles.input} onChangeText={setZIP} value={cust_ZIP}
        placeholder="ZIP-Code" />
      <TextInput style={styles.input} onChangeText={setCity} value={cust_city}
        placeholder="City" />
      <TextInput style={styles.input} onChangeText={setCountry} value={cust_country}
        placeholder="Country" />
      <Text style={styles.subsection}> Seller / Lely Center (LC), Installation Company, Project Coordinator </Text>
      <TextInput style={styles.input} onChangeText={setLelyNum} value={lely_num}
        placeholder="Lely Center No." />
      <TextInput style={styles.input} onChangeText={setLelyName} value={lely_name}
        placeholder="Lely Center Name" />
      <TextInput style={styles.input} onChangeText={setArea} value={lely_area}
        placeholder="Service Area" />
      <TextInput style={styles.input} onChangeText={setCoordinatorName} value={lely_coordinatorname}
        placeholder="Name Project Coordinator" />
      <TextInput style={styles.input} onChangeText={setCompany} value={installation_co}
        placeholder="Installation Company" />
      <TouchableOpacity onPress={nextPage} style={styles.button}>
        <Text style={styles.buttonText}>Next Page</Text>
      </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
  },
  scrollView: {
    marginHorizontal: 1,
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#c30a14',
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
  button: {
    backgroundColor: '#850c18',
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
  subsection: {
    fontSize: 18,
    marginTop: 10,
    marginBottom: 10,
    fontWeight: 'bold',
  },
});

