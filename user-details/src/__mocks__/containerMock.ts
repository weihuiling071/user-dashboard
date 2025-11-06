import { Context, createContext, ReactNode } from 'react';

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone?: string;
  website?: string;
  company: {
    name: string;
  };
  address: {
    city: string;
  };
}

export interface UserContextType {
  users: User[];
  loading: boolean;
  selectedUser: User | null;
  setSelectedUser: (user: User | null) => void;
  refresh: () => Promise<void>;
  updateUser: (user: User) => void;
}

export const UserContext = createContext<UserContextType>({
  users: [],
  loading: false,
  selectedUser: null,
  setSelectedUser: () => {},
  refresh: async () => {},
  updateUser: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

export const fetchUsers = async (): Promise<User[]> => [];
export const fetchUserById = async (id: number): Promise<User | undefined> => undefined;
export const saveUserLocal = (user: User): void => {};
export const loadFromLocal = (): User[] | null => null;