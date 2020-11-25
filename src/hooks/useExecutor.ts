import AsyncStorage from '@react-native-async-storage/async-storage';
import {useState} from 'react';
import {ADDRESS} from '../consts/consts';
import {Alert, ToastAndroid} from 'react-native';
import {firebase} from '@react-native-firebase/storage';
import fs from 'react-native-fs';
import {useAuth} from './useAuth';

const firebaseConfig = {
  apiKey: 'AIzaSyAga6iwG5pOoXkg3toCohjgoAGd0gSPIGE',
  authDomain: 'khimchistka.firebaseapp.com',
  databaseURL: 'https://khimchistka.firebaseio.com',
  projectId: 'khimchistka',
  storageBucket: 'khimchistka.appspot.com',
  messagingSenderId: '263998613518',
  appId: '1:263998613518:web:0830cd5c208ecc36f9b45f',
};
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const storage = firebase.storage();

export type ExecutorType = {
  name: string;
  description: string;
  type: string;
  images: string[];
  serviceTypes: string[];
};

export type FirstStepType = {
  name: string;
  description: string;
  type: string;
  images: string[];
};

export type ExecutorUpdatedType = {
  _id: string;
  name: string;
  description: string;
  type: string;
  images: string[];
  serviceTypes: [{name: string; price: number}];
};

export const useExecutor = () => {
  const [executors, setExecutors] = useState<ExecutorUpdatedType[]>([]);
  const [executor, setExecutor] = useState<ExecutorType>({
    name: '',
    description: '',
    type: '',
    images: [],
    serviceTypes: [],
  });
  const [loading, setLoading] = useState(false);
  const [firstStepFinish, setFirsttStepFinish] = useState(false);
  const {checkAuth} = useAuth();

  const createURL = async (uri: string) => {
    try {
      const ref = storage.ref(
        `${executor.name}/${new Date().toLocaleDateString()}`,
      );
      const data = await fs.readFile(uri, 'base64');
      await ref.putString(data, 'base64');
      return ref.getDownloadURL();
    } catch (err) {
      console.error(err);
    }
  };

  const saveFirstStep = (executorData: FirstStepType) => {
    const {name, description, type, images} = executorData;
    setExecutor((prevState) => ({
      ...prevState,
      name,
      description,
      type,
      images,
    }));
    setFirsttStepFinish(true);
  };

  const toFirstStep = () => {
    setFirsttStepFinish(false);
  };

  const add = (item: string, key: 'images' | 'serviceTypes') => {
    setExecutor((prevState: ExecutorType) => ({
      ...prevState,
      [key]: [...prevState[key], item],
    }));
  };

  const deleteExe = (item: string, key: 'images' | 'serviceTypes') => {
    setExecutor((prevState: ExecutorType) => ({
      ...prevState,
      [key]: prevState[key].filter((item) => item !== item),
    }));
  };

  const change = (item: string, key: string) => {
    setExecutor((prevState: ExecutorType) => ({
      ...prevState,
      [key]: item,
    }));
  };

  const createNewExecutor = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        return checkAuth();
      }

      const uploadedImages = await Promise.all(
        executor.images.map(async (uri) => await createURL(uri)),
      );

      const response: Response = await fetch(`${ADDRESS}/executor/add`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          authorization: token,
        },
        body: JSON.stringify({...executor, images: uploadedImages}),
      });
      if (response.ok) {
        ToastAndroid.showWithGravity(
          'Created',
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
        );
        setExecutor({
          name: '',
          description: '',
          type: '',
          images: [],
          serviceTypes: [],
        });
        setLoading(false);
        setFirsttStepFinish(false);
      } else {
        const data = await response.json();
        throw new Error(data.message);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      Alert.alert('Creating faild', err.message);
    }
  };

  const getAll = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        checkAuth();
        throw new Error('Access denied');
      }

      const response: Response = await fetch(`${ADDRESS}/executor/all`, {
        method: 'GET',
        headers: {
          authorization: token,
          'content-type': 'application/json',
        },
      });

      console.log(response);
      if (response.ok) {
        const {data} = await response.json();
        console.log(data);
        setExecutors(data);
        setLoading(false);
      } else {
        const {message} = await response.json();
        throw new Error(message);
      }
    } catch (err) {
      setLoading(false);
      Alert.alert('Server error', err.message);
    }
  };

  return {
    firstStepFinish,
    loading,
    saveFirstStep,
    createNewExecutor,
    toFirstStep,
    add,
    change,
    deleteExe,
    executor,
    executors,
    getAll,
  };
};
