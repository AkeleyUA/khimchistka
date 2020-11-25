import React, {FC, useContext, useEffect, useState} from 'react';
import {Alert, Button, StyleSheet, TextInput, View} from 'react-native';
import {AuthContext} from '../contexts/AuthContext';

type Props = {
  navigation: any;
};

const ResetPasswordScreen: FC<Props> = ({navigation}) => {
  const {
    reset,
    confirmReset,
    confirmed,
    newPasswordUpdate,
    updatedPassword,
    clear,
  } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [sent, setSent] = useState(false);
  const [newPassword, setNewPassword] = useState({
    password: '',
    passwordR: '',
  });

  const changeEmailHandler = (text: string) => {
    setEmail(text);
  };

  const changeCodeHandler = (text: string) => {
    if (!confirmed) {
      setCode(text);
    }
  };

  const changePasswordHandler = (text: string, field: string) => {
    setNewPassword((prevState) => ({...prevState, [field]: text}));
  };

  const onReset = () => {
    reset(email);
    setSent(true);
  };

  const onEdit = () => {
    setSent(false);
    setEmail('');
    setCode('');
  };

  const onConfirm = () => {
    if (code.length !== 4) {
      Alert.alert('Code invalid', 'The code must be 4 digits');
    } else {
      confirmReset(code, email);
    }
  };

  const onChangePassword = () => {
    if (newPassword.password === newPassword.passwordR) {
      newPasswordUpdate(code, email, newPassword.password);
    } else {
      Alert.alert('Passwords error', 'Passwords do not match');
    }
  };

  useEffect(() => {
    if (updatedPassword) {
      setEmail('');
      setSent(false);
      setCode('');
      setNewPassword({
        password: '',
        passwordR: '',
      });
      clear();
      navigation.navigate('Login');
    }
  }, [updatedPassword]);

  return (
    <View style={styles.container}>
      <View style={styles.registerForm}>
        <TextInput
          editable={!sent}
          clearTextOnFocus
          value={email}
          style={styles.input}
          keyboardType="email-address"
          onChangeText={(text) => changeEmailHandler(text)}
          placeholder="enter email"
        />
        {!sent && !confirmed && (
          <View style={styles.buttonGroup}>
            <Button onPress={onReset} title="Send code" color="green" />
          </View>
        )}

        {sent && !confirmed && (
          <>
            <TextInput
              clearTextOnFocus
              value={code}
              style={styles.input}
              keyboardType="numeric"
              onChangeText={(text) => changeCodeHandler(text)}
              placeholder="Enter reset code"
            />
            <View style={styles.secondButtonGroup}>
              <Button onPress={onEdit} title="Edit" color="lightgreen" />
              <Button
                onPress={onConfirm}
                title="Confirm"
                color="green"
                disabled={code.length !== 4}
              />
            </View>
          </>
        )}
        {confirmed && (
          <>
            <TextInput
              clearTextOnFocus
              value={newPassword.password}
              style={styles.input}
              secureTextEntry
              onChangeText={(text) => changePasswordHandler(text, 'password')}
              placeholder="enter new password"
            />
            <TextInput
              clearTextOnFocus
              value={newPassword.passwordR}
              style={styles.input}
              secureTextEntry
              onChangeText={(text) => changePasswordHandler(text, 'passwordR')}
              placeholder="repeat new password"
            />
            <View style={styles.buttonGroup}>
              <Button
                onPress={onChangePassword}
                title="Change password"
                color="green"
              />
            </View>
          </>
        )}
      </View>
    </View>
  );
};

export default ResetPasswordScreen;

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
  secondButtonGroup: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
