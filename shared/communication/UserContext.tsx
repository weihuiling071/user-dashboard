import React, { useMemo, createContext, useState, useEffect, useCallback } from 'react';
import { User } from '../types/User';
import { fetchUsers, saveUserLocal } from '../api/userService';

type ContextValue = {
  users: User[];
  loading: boolean;
  selectedUser: User | null;
  setSelectedUser: (u: User | null) => void;
  refresh: () => Promise<void>;
  updateUser: (u: User) => void;
};

export const UserContext = createContext<ContextValue>({
  users: [],
  loading: false,
  selectedUser: null,
  setSelectedUser: () => {},
  refresh: async () => {},
  updateUser: () => {},
});

export const UserProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }: { children: React.ReactNode }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchUsers();
      setUsers(data);
    } finally {
      setLoading(false);
    }
  }, [fetchUsers]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const updateUser = useCallback((updated: User) => {
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    setSelectedUser(updated);
    saveUserLocal(updated);
  }, []);

  const contextValue = useMemo<ContextValue>(
    () => ({ users, loading, selectedUser, setSelectedUser, refresh, updateUser }),
    [users, loading, selectedUser, updateUser, refresh]
  );
  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
};
