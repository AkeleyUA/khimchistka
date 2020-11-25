import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect, useState} from 'react';
import {Alert} from 'react-native';
import {ADDRESS} from '../consts/consts';
import {useAuth} from './useAuth';
import {ExecutorUpdatedType} from './useExecutor';
import {User as UserType} from './useUser';

export type OrderType = {
  _id: string;
  executor: ExecutorUpdatedType;
  user: UserType;
  serviceType: {
    name: string;
    price: number;
  };
  status: number;
  date: Date;
  rejectReason?: string;
};

export type UpdatesForOrder = {
  _id: string;
  date: Date;
  user: {
    _id: string;
    firstName: string;
    secondName: string;
    role: string;
  };
  serviceType: {
    name: string;
    price: number;
  };
  status: number;
};

export const useOrders = () => {
  const [loading, setLoading] = useState(false);
  const [orderLoading, setOrederLoading] = useState<string[]>([]);
  const [orders, setOreders] = useState<OrderType[]>([]);
  const {checkAuth} = useAuth();

  const getOrders = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        checkAuth();
        throw Error('Access denied');
      } else {
        const response: Response = await fetch(`${ADDRESS}/orders/all`, {
          headers: {
            authorization: token,
          },
        });
        if (response.ok) {
          const {data} = await response.json();
          setOreders(data);
          setLoading(false);
        } else {
          const {message} = await response.json();
          throw new Error(message);
        }
      }
    } catch (err) {
      setLoading(false);
      Alert.alert('Order error', err.message);
      console.error(err);
    }
  };

  // TODO Статусы

  // * 0 = new
  // ? 1 = inprogress
  // ! 2 = rejected
  // _ 3 = finished

  const changeOrder = async (order: UpdatesForOrder, rejectReason?: string) => {
    try {
      setOrederLoading((prevState) => [...prevState, order._id]);
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        throw new Error('no auth');
      } else {
        const response: Response = await fetch(
          `${ADDRESS}/orders/changeOrder`,
          {
            method: 'PUT',
            headers: {
              authorization: token,
              'content-type': 'application/json',
            },
            body: JSON.stringify({updatedOrder: order, rejectReason}),
          },
        );

        if (response.ok) {
          const {data} = await response.json();
          setOrederLoading((prevState) =>
            prevState.filter((id) => id !== order._id),
          );
          setOreders(data);
        } else {
          const {message} = await response.json();
          throw new Error(message);
        }
      }
    } catch (err) {
      setOrederLoading((prevState) =>
        prevState.filter((id) => id !== order._id),
      );
      Alert.alert(err.message);
    }
  };

  return {orders, getOrders, loading, changeOrder, orderLoading};
};
