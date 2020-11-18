import React, {FC, useState} from 'react';
import {Button, StyleSheet, TextInput, View} from 'react-native';
import {Link} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = {
  navigation: any;
};

const RegisterScreen: FC<Props> = ({navigation}) => {
  const [form, setForm] = useState({
    email: '',
    password: '',
    passwordR: '',
  });

  const registerHandler = async () => {
    if (form.password !== form.passwordR) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Passwords do not match',
      });
    } else {
      try {
        const response = await fetch(
          'http://192.168.0.104:4000/auth/register',
          {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-type': 'application/json',
            },
            body: JSON.stringify({email: form.email, password: form.password}),
          },
        );
        const data = await response.json();
        if (response.ok) {
          AsyncStorage.setItem('token', data.token);
          Toast.show({
            type: 'success',
            text1: 'Welcome!',
            text2: data.message,
          });
        } else {
          throw new Error(data.message);
        }
      } catch (err) {
        Toast.show({
          type: 'error',
          text1: 'Auth error',
          text2: err.message,
        });
      }
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
