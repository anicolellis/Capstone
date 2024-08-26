/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import * as React from 'react';
import type {PropsWithChildren, SyntheticEvent} from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';

import { useForm } from 'react-hook-form';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

// local imports
//import Input from './components/Input';
//import Form from './components/Form';
//import validation from './validation';

/*type SectionProps = PropsWithChildren<{
  title: string;
}>;*/

interface FormData {
  name: string
  email: string
  password: string
};

/*function Section({children, title}: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}*/

function App() {
  //const isDarkMode = useColorScheme() === 'dark';

  /*const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };*/

  const { handleSubmit, register, formState: {errors} } = useForm<FormData>();

  const onSubmit = (values: FormData) => {
    console.log(values);
  };

  return (
    <main className="main form">
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <div>
          <input {...register("name")} id="name" type="text" />
        </div>
        <div>
          <input {...register("email")} id="email" type="text" />
        </div>
        
        <div>
          <input {...register("password")} id="password" type="text" />
        </div>
        
        <button type="submit">Submit</button>
      </form>
    </main>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    width: '70%',
  },
});

export default App;
