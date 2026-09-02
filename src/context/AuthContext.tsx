import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  plan: string;
  organization: string;
  location: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string) => void;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default mock user to simulate a logged-in user from a backend
const DEFAULT_USER: User = {
  id: 'usr_1',
  name: 'Disha Guglani',
  email: 'disha@apiary.com',
  role: 'Apiary Manager',
  plan: 'PRO ACCOUNT',
  organization: 'Guglani Apiaries',
  location: 'Gujarat, India'
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Simulate loading user from session/localStorage on mount
    const savedUser = localStorage.getItem('hive_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        setUser(DEFAULT_USER);
      }
    } else {
      setUser(DEFAULT_USER);
    }
  }, []);

  const login = (email: string) => {
    // In a real app, this would validate credentials and fetch the user profile.
    // Here we just mock setting the user based on the email provided.
    const newUser = { ...DEFAULT_USER, email, name: email.split('@')[0].toUpperCase() };
    setUser(newUser);
    localStorage.setItem('hive_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hive_user');
  };

  const updateProfile = (updates: Partial<User>) => {
    setUser(prev => {
      if (!prev) return prev;
      const updatedUser = { ...prev, ...updates };
      localStorage.setItem('hive_user', JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
