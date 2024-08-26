import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CustomerSignIn} from './CustomerSignIn';
import { CustomerSignIn2} from './CustomerSignIn2'; 
import { SignInScreenTechnician } from './SignInScreenTechnician'; 
import { CustomerSignUpScreen} from './CustomerSignUpScreen'; 
import { CounterScreen } from './CounterScreen'; 
import { FormSelectionScreen } from './FormSelectionScreen'; 
import { FormCreatorScreen } from './FormCreatorScreen'; 
import { DynamicFormScreen } from './DynamicFormScreen.tsx'; 
import { VectorFormStart } from './VectorFormStart';
import { VectorForm2 } from './VectorForm2';
import { VectorForm3 } from './VectorForm3';
import { ProjectSelectionScreen } from './ProjectSelectionScreen'; 
import { CustomerSelectionScreen } from './CustomerSelectionScreen'; 
import { AstronautFormStart } from './AstronautFormStart';
import { AstronautForm2 } from './AstronautForm2';
import { AstronautForm3 } from './AstronautForm3';
import { AstronautForm4 } from './AstronautForm4';
import { AstronautForm5 } from './AstronautForm5';
import { HorizonFormStart } from './HorizonFormStart.tsx';
import { HorizonForm2 } from './HorizonForm2.tsx';

// Define the required params for navigating to each screen
export type RootStackParamList = {
  CustomerSelection: undefined;
  ProjectSelection: undefined;
  CustomerSignIn: undefined;
  CustomerSignIn2: undefined;
  SignInTechnician: undefined;
  CustomerSignUp: undefined;
  Counter: undefined;
  FormSelection: undefined;
  FormCreator: undefined;
  DynamicForm: undefined;
  VectorForm: undefined;
  VectorForm2: { 
    farm: string,
    first: string,
    last: string,
    num: string,
    street: string,
    zip: string,
    city: string,
    country: string,
    lelynum: string,
    lelyname: string,
    lelyarea: string,
    coordname: string,
    installco: string
  };
  VectorForm3: {
      farm:string,
      first:string,
      last:string,
      num:string,
      street:string,
      zip:string,
      city:string,
      country:string,
      lelynum:string,
      lelyname:string,
      lelyarea:string,
      coordname:string,
      installco:string,
      machineTypes:Array<string>,
      machineDates:Array<string>,
      machineItemNos:Array<string>,
      machineSerialNos:Array<string>
  };
  AstronautForm: undefined;
  AstronautForm2: { 
    farm: string,
    first: string,
    last: string,
    num: string,
    street: string,
    zip: string,
    city: string,
    country: string,
    lelynum: string,
    lelyname: string,
    lelyarea: string,
    coordname: string
  };
  AstronautForm3: {
      farm:string,
      first:string,
      last:string,
      num:string,
      street:string,
      zip:string,
      city:string,
      country:string,
      lelynum:string,
      lelyname:string,
      lelyarea:string,
      coordname:string,
      machineTypes:Array<string>,
      machineDates:Array<string>,
      machineItemNos:Array<string>,
      machineSerialNos:Array<string>
  };
  AstronautForm4: {
    farm:string,
    first:string,
    last:string,
    num:string,
    street:string,
    zip:string,
    city:string,
    country:string,
    lelynum:string,
    lelyname:string,
    lelyarea:string,
    coordname:string,
    machineTypes:Array<string>,
    machineDates:Array<string>,
    machineItemNos:Array<string>,
    machineSerialNos:Array<string>,
    checklistVals1:Array<string>,
    checklistRemarks1:Array<string>,
};
  AstronautForm5: {
    farm:string,
    first:string,
    last:string,
    num:string,
    street:string,
    zip:string,
    city:string,
    country:string,
    lelynum:string,
    lelyname:string,
    lelyarea:string,
    coordname:string,
    machineTypes:Array<string>,
    machineDates:Array<string>,
    machineItemNos:Array<string>,
    machineSerialNos:Array<string>
    checklistVals1:Array<string>,
    checklistRemarks1:Array<string>,
    checklistVals2:Array<string>,
    checklistRemarks2:Array<string>,
  };
  HorizonForm: undefined;
  HorizonForm2: {
    farm: string,
    first: string,
    last: string,
    num: string,
    street: string,
    zip: string,
    city: string,
    country: string,
    lelynum: string,
    lelyname: string,
    lelyarea: string,
    coordname: string
  }
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignInTechnician">
        <Stack.Screen name="ProjectSelection" component={ProjectSelectionScreen} options={{ title: 'Select Project' }} />
        <Stack.Screen name="CustomerSignIn" component={CustomerSignIn} options={{ title: 'Customer Sign' }} />
        <Stack.Screen name="CustomerSignIn2" component={CustomerSignIn2} options={{ title: 'Customer Sign 2' }} />
        <Stack.Screen name="SignInTechnician" component={SignInScreenTechnician} options={{ title: 'Sign In Technician' }} />
        <Stack.Screen name="CustomerSignUp" component={CustomerSignUpScreen} options={{ title: 'Customer Sign Up' }} />
        <Stack.Screen name="Counter" component={CounterScreen} options={{ title: 'Counters' }} />
        <Stack.Screen name="FormSelection" component={FormSelectionScreen} options={{ title: 'Form Selection' }} />
        <Stack.Screen name="FormCreator" component={FormCreatorScreen} options={{ title: 'Form Creator' }} />
        <Stack.Screen name="DynamicForm" component={DynamicFormScreen} options={{ title: 'Dyanmic Form Screen' }} />
        <Stack.Screen name="CustomerSelection" component={CustomerSelectionScreen} options={{ title: 'Select Customer' }} />
        <Stack.Screen name="VectorForm" component={VectorFormStart} options={{ title: 'Vector Handover Form: Page 1' }} />
        <Stack.Screen name="VectorForm2" component={VectorForm2} options={{ title: 'Vector Handover Form: Page 2' }} />
        <Stack.Screen name="VectorForm3" component={VectorForm3} options={{ title: 'Vector Handover Form: Page 3' }} />
        <Stack.Screen name="AstronautForm" component={AstronautFormStart} options={{ title: 'Astronaut Handover Declaration: Page 1' }} />
        <Stack.Screen name="AstronautForm2" component={AstronautForm2} options={{ title: 'Astronaut Handover Declaration: Page 2' }} />
        <Stack.Screen name="AstronautForm3" component={AstronautForm3} options={{ title: 'Checklist: Lely Astronaut Milking System (LAM) Page 1' }} />
        <Stack.Screen name="AstronautForm4" component={AstronautForm4} options={{ title: 'Checklist: Lely Astronaut Milking System (LAM) Page 2' }} />
        <Stack.Screen name="AstronautForm5" component={AstronautForm5} options={{ title: 'Checklist: Lely Astronaut Milking System (LAM) Page 3' }} />
        <Stack.Screen name="HorizonForm" component={HorizonFormStart} options={{ title: 'Horizon Server Form: Page 1' }} />
        <Stack.Screen name="HorizonForm2" component={HorizonForm2} options={{ title: 'Horizon Server Form: Page 2' }} />   
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

