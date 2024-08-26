import React, { useState } from "react";
import { Text, TextInput, View, StyleSheet, Button, Image } from "react-native"

const App = () => {
  const [equipnum, setEquip] = useState("");
  const [serialnum, setSerial] = useState("");
  const [machineType, setMachine] = useState("");
  const [display, setDisplay] = useState(false);

  const submitForm =()=>{
    setDisplay(true);
  }

  return (
    <View>
      <View style={styles.container}>
        <Image style={styles.logo} source={require('./lely_logo.png')}/>
      </View>
      <Text style={{ fontSize: 30, color:'red' }}> Example Form </Text>
      <Text style={{ fontSize: 18, marginTop: 10 }}> Equipment number </Text>
      <TextInput style={styles.textInput} 
      placeholder="Enter your equipment number" 
      onChangeText={(text)=>{setEquip(text)}}
      value={equipnum}
      />
      <Text style={{ fontSize: 18, marginTop: 10 }}> Serial number </Text>
      <TextInput style={styles.textInput} 
      placeholder="Enter your serial number" 
      onChangeText={(text)=>{setSerial(text)}}
      value={serialnum}
      />
      <Text style={{ fontSize: 18, marginTop: 10 }}> Machine type </Text>
      <TextInput style={styles.textInput} 
      placeholder="Enter your machine type" 
      onChangeText={(text)=>{setMachine(text)}}
      value={machineType}
      />
      <Button title="Submit" color={'black'} onPress={submitForm} />
      <View>
        {
          display ?
          <View>
            <Text style={{fontSize:20}}>Thank you for completing this form!</Text>
            <Text style={{fontSize:20}}>Your equipment number: {equipnum}</Text>
            <Text style={{fontSize:20}}>Your serial number: {serialnum}</Text>
            <Text style={{fontSize:20}}>Your machine type: {machineType}</Text>
          </View> 
          : null 
        }
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  textInput : {
    fontSize : 18,
    borderWidth: 2,
    borderColor: 'grey',
    margin: 10
  },
  logo : {
    width: '50%',
    height: undefined,
    aspectRatio: 1,
    resizeMode: 'contain'
  },
  container : {
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default App;