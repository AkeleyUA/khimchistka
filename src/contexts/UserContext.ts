import {createContext} from 'react';
import {User} from '../hooks/useUser';

export const UserContext = createContext({
  user: null as User | null,
  getUser: async (): Promise<any> => {},
});
