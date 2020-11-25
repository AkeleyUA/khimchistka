import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {useContext, useState} from 'react';
import {Alert} from 'react-native';
import {navigateWithRef} from '../../App';
import {ADDRESS} from '../consts/consts';
import {OrdersContext} from '../contexts/OrdersContext';
import {UserContext} from '../contexts/UserContext';
import {useAuth} from './useAuth';

export type Form = {
  creator: {id: string; firstName: string; secondName: string};
  orderData: {date: Date; executorId: string; serviceType: string};
};

export const useSelectService = () => {
  const {checkAuth} = useAuth();
  const [loading, setLoading] = useState(false);
  const {getUser} = useContext(UserContext);
  const {getOrders} = useContext(OrdersContext);

  const createOrder = async (form: Form) => {
    setLoading(true);
    try {
      if (!form?.creator?.firstName || !form?.creator?.secondName) {
        throw new Error('Enter user data');
      }
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        checkAuth();
      } else {
        const response: Response = await fetch(`${ADDRESS}/orders/create`, {
          method: 'POST',
          headers: {
            authorization: token,
            'content-type': 'application/json',
          },
          body: JSON.stringify(form),
        });
        if (response.ok) {
          navigateWithRef('Orders');
          setLoading(false);
          getUser();
          getOrders();
        } else {
          const {message} = await response.json();
          throw new Error(message);
        }
      }
    } catch (err) {
      setLoading(false);
      Alert.alert('Oreder error', err.message);
    }
  };

  return {
    createOrder,
    loading,
  };
};
