import {createContext} from 'react';

type From = {
  email: string;
  password: string;
};

export const AuthContext = createContext({
  login: async ({}: From) => {},
  logout: async () => {},
  clear: () => {},
  register: async ({}: From) => {},
  reset: async (email: string) => {},
  checkAuth: async (): Promise<boolean | void> => {},
  newPasswordUpdate: async (
    code: string,
    email: string,
    newPassword: string,
  ): Promise<boolean | void> => {},
  confirmReset: async (
    code: string,
    email: string,
  ): Promise<boolean | void> => {},
  isAuth: false,
  loading: true,
  confirmed: false,
  updatedPassword: false,
});
