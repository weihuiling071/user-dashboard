import '@testing-library/jest-dom';
import 'whatwg-fetch';

import { createContext } from 'react';

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  company: {
    name: string;
  };
}

export interface UserContextType {
  users: User[];
  selectedUser: User | null;
  loading: boolean;
  setSelectedUser: (user: User) => void;
  refresh: () => void;
  updateUser: (user: User) => void;
}

export const UserContext = createContext<UserContextType>({
  users: [],
  selectedUser: null,
  loading: false,
  setSelectedUser: () => {},
  refresh: () => {},
  updateUser: () => {},
});