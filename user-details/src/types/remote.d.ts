declare module 'container/shared' {
  export interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    phone?: string;
    website?: string;
  }

  export function fetchUsers(): Promise<User[]>;
  export function fetchUserById(id: number): Promise<User | undefined>;
  export function saveUserLocal(user: User): void;
  export function loadFromLocal(): User[] | null;

  import { Context } from 'react';
  export interface UserContextType {
    users: User[];
    loading: boolean;
    selectedUser: User | null;
    setSelectedUser: (user: User | null) => void;
    refresh: () => void;
    navigate?: (path: string) => void;
    updateUser: (user: User) => void;
  }
  export const UserContext: Context<UserContextType>;
  export const UserProvider: ({ children }: { children: React.ReactNode }) => JSX.Element;
}