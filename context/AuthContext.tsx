import React, { createContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login } from '@/app/apis/auth.api';
import { router } from 'expo-router';

type User = {
  username: string;
  password: string;
};

type AuthContextType = {
  user: User | null;
  authLogin: (user: User) => void;
  logout: () => void;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  authLogin: () => {},
  logout: () => {},
  loading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const authLogin = async (userData: User) => {
    /*const response = await login(userData.username, userData.password);
    await AsyncStorage.setItem('username', userData.username);
    await AsyncStorage.setItem('password', userData.password);

    setUser(userData);*/
  };

  const logout = async () => {
    await AsyncStorage.removeItem('username');
    await AsyncStorage.removeItem('password');
    router.replace('/Login')
    setUser(null);
  };

  const loadUser = async () => {
    const json = await AsyncStorage.getItem('user');
    if (json) {
      setUser(JSON.parse(json));
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, authLogin, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
