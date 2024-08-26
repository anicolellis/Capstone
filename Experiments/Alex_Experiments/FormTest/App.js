import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, TextInput, View, Button } from 'react-native';
import { useForm } from "react-hook-form";
import { Formik } from "formik";

export default function App() {
  <Formik
     initialValues={{ email: '' }}
     onSubmit={values => console.log(values)}
  >
     {({ handleChange, handleBlur, handleSubmit, values }) => (
       <View>
         <TextInput
           onChangeText={handleChange('email')}
           onBlur={handleBlur('email')}
           value={values.email}
         />
         <Button onPress={handleSubmit} title="Submit" />
       </View>
     )}
   </Formik>
};
