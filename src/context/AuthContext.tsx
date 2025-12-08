/**
 * Credits / References:
 * - React Context API documentation: https://react.dev/reference/react/createContext
 * - React useContext hook: https://react.dev/reference/react/useContext
 * - MDN Web Storage API (localStorage): https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
 * - React TypeScript patterns: https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/context
 * - React Context for Beginners tutorial: https://www.freecodecamp.org/news/react-context-for-beginners/
 * - Managing User Authentication in React: https://blog.logrocket.com/managing-user-authentication-in-react/
 */
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Check localStorage on mount to restore session
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsLoggedIn(true);
      } catch (err) {
        console.error('Failed to parse saved user data:', err);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
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
