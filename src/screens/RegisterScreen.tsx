import React, {FC, useContext, useState} from 'react';
import {Alert, Button, StyleSheet, TextInput, View} from 'react-native';
import {Link} from '@react-navigation/native';
import {AuthContext} from '../contexts/AuthContext';

// type Props = {
//   navigation: any;
// };

const RegisterScreen: FC = () => {
  const auth = useContext(AuthContext);
  const [form, setForm] = useState({
    email: '',
    password: '',
    passwordR: '',
  });

  const registerHandler = async () => {
    if (form.password !== form.passwordR) {
      Alert.alert('Error', 'Passwords do not match');
    } else {
      auth.register(form);
    }
  };

  const changeHandler = (text: string, key: string) => {
    setForm((prevState) => ({...prevState, [key]: text}));
  };

  return (
    <View style={styles.container}>
      <View style={styles.registerForm}>
        <TextInput
          clearTextOnFocus
          value={form.email}
          style={styles.input}
          keyboardType="email-address"
          onChangeText={(text) => changeHandler(text, 'email')}
          placeholder="enter email"
        />
        <TextInput
          clearTextOnFocus
          value={form.password}
          style={styles.input}
          secureTextEntry
          onChangeText={(text) => changeHandler(text, 'password')}
          placeholder="enter password"
        />
        <TextInput
          clearTextOnFocus
          value={form.passwordR}
          style={styles.input}
          secureTextEntry
          onChangeText={(text) => changeHandler(text, 'passwordR')}
          placeholder="repeat password"
        />
        <View style={styles.buttonGroup}>
          <Button onPress={registerHandler} title="Register" color="green" />
        </View>
        <Link style={styles.link} to="/Login">
          Login
        </Link>
      </View>
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    borderBottomWidth: 1,
    borderColor: 'green',
    width: '100%',
  },
  registerForm: {
    width: '90%',
  },
  link: {
    color: 'green',
    alignSelf: 'center',
    marginTop: 20,
  },
  buttonGroup: {
    marginTop: 20,
  },
});
