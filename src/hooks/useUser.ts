import AsyncStorage from '@react-native-async-storage/async-storage';
import {useState} from 'react';
import {ADDRESS} from '../consts/consts';
import {Alert} from 'react-native';
import {useAuth} from './useAuth';

export type User = {
  firstName?: string;
  secondName?: string;
  _id: string;
  email: string;
  credits: number;
  role: 'user' | 'admin';
};

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const {checkAuth} = useAuth();

  const getUser = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        return checkAuth();
      } else {
        const response: Response = await fetch(`${ADDRESS}/users/current`, {
          method: 'GET',
          headers: {
            authorization: String(token),
            accept: 'application/json',
            'content-type': 'application/json',
          },
        });

        if (response.ok) {
          const user = await response.json();
          setUser(user);
        } else {
          const {message} = await response.json();
          throw new Error(message);
        }
      }
    } catch (err) {
      console.error(err);
      Alert.alert(err.message);
    }
  };
  return {getUser, user};
};
