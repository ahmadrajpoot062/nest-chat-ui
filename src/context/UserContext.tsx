import React, { createContext, useContext, useEffect, useState } from 'react';

interface User { username: string; avatar?: string; }
interface Context { user: User | null; setUser: (u: string, a?: string) => void; logout: () => void; }

const UserContext = createContext<Context>({ user: null, setUser: () => {}, logout: () => {} });
export const useUser = () => useContext(UserContext);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUserState(JSON.parse(stored));
  }, []);

  useEffect(() => {
    user ? localStorage.setItem('user', JSON.stringify(user)) : localStorage.removeItem('user');
  }, [user]);

  const setUser = (username: string, avatar?: string) => setUserState({ username, avatar });
  const logout = () => { setUserState(null); localStorage.removeItem('token'); };

  return <UserContext.Provider value={{ user, setUser, logout }}>{children}</UserContext.Provider>;
};
