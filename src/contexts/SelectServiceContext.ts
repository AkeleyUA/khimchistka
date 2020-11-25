import {createContext} from 'react';
import {Form} from '../hooks/useSelectService';

export const SelectServiceContext = createContext({
  loading: false,
  createOrder: async (form: Form): Promise<void> => {},
});
