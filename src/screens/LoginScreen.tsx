import React, {FC, useContext, useState} from 'react';
import {Button, StyleSheet, Text, TextInput, View} from 'react-native';
import {Link} from '@react-navigation/native';
import {AuthContext} from '../contexts/AuthContext';

const LoginScreen: FC = () => {
  const {login} = useContext(AuthContext);
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const changeHandler = (text: string, key: string) => {
    setForm((prevState) => ({...prevState, [key]: text}));
  };
  const onLogin = () => login(form);

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
        <View style={styles.buttonGroup}>
          <Button onPress={onLogin} title="Login" color="green" />
        </View>
        <View style={styles.linkGroup}>
          <Link style={styles.link} to="/ResetPassword">
            Reset password
          </Link>
          <Link style={styles.link} to="/Register">
            Register
          </Link>
        </View>
      </View>
      <View style={styles.details}>
        <Text style={styles.detailsText}>Powered by React Native</Text>
        <Text style={styles.detailsText}>Develop by Alexandr Stepaniuk</Text>
      </View>
    </View>
  );
};

export default LoginScreen;

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
  linkGroup: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  link: {
    color: 'green',
    alignSelf: 'center',
    marginTop: 20,
  },
  buttonGroup: {
    marginTop: 20,
  },
  details: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'lightgrey',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  detailsText: {
    fontSize: 8,
    marginVertical: 2,
    color: 'green',
  },
});
