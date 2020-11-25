import AsyncStorage from '@react-native-async-storage/async-storage';
import {useState} from 'react';
import {ADDRESS} from '../consts/consts';
import {Alert} from 'react-native';

type Form = {
  email: string;
  password: string;
};

export const useAuth = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [updatedPassword, setUpdatedPassword] = useState(false);

  const checkAuth = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem('token');
    setLoading(false);
    setIsAuth(Boolean(token));
  };

  const register = async (form: Form) => {
    setLoading(true);
    try {
      const response = await fetch(`${ADDRESS}/auth/register`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-type': 'application/json',
        },
        body: JSON.stringify({email: form.email, password: form.password}),
      });
      const data = await response.json();
      if (response.ok) {
        AsyncStorage.setItem('token', data.token);
        setIsAuth(true);
        setLoading(false);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setLoading(false);
      Alert.alert('Auth err', err.message);
    }
  };

  const login = async (form: Form) => {
    setLoading(true);
    try {
      const response = await fetch(`${ADDRESS}/auth/login`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-type': 'application/json',
        },
        body: JSON.stringify({email: form.email, password: form.password}),
      });
      const data = await response.json();
      if (response.ok) {
        AsyncStorage.setItem('token', data.token);
        setIsAuth(true);
        setLoading(false);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Auth err', err.message);
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    await AsyncStorage.clear();
    setIsAuth(false);
    setLoading(false);
  };

  const reset = async (email: string) => {
    try {
      const response = await fetch(`${ADDRESS}/auth/resetPassword`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-type': 'application/json',
        },
        body: JSON.stringify({email}),
      });
      if (response.ok) {
        console.log('success sent');
      } else {
        throw Error('Server error');
      }
    } catch (err) {
      Alert.alert('Auth error', err.message);
    }
  };

  const confirmReset = async (code: string, email: string) => {
    try {
      const respones = await fetch(`${ADDRESS}/auth/resetPasswordConfirm`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-type': 'application/json',
        },
        body: JSON.stringify({code, email}),
      });
      if (respones.ok) {
        setConfirmed(true);
      } else {
        const data = await respones.json();
        throw new Error(data.message);
      }
    } catch (err) {
      Alert.alert('Reset error', err.message);
    }
  };

  const newPasswordUpdate = async (
    code: string,
    email: string,
    newPassword: string,
  ) => {
    try {
      const respones = await fetch(`${ADDRESS}/auth/updatePassword`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-type': 'application/json',
        },
        body: JSON.stringify({code, email, newPassword}),
      });
      if (respones.ok) {
        setUpdatedPassword(true);
      } else {
        const data = await respones.json();
        throw new Error(data.message);
      }
    } catch (err) {
      Alert.alert('Reset error', err.message);
    }
  };

  const clear = () => {
    setConfirmed(false);
    setUpdatedPassword(false);
  };

  return {
    login,
    logout,
    register,
    checkAuth,
    reset,
    confirmReset,
    newPasswordUpdate,
    clear,
    isAuth,
    loading,
    confirmed,
    updatedPassword,
  };
};
