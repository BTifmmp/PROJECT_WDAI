import React, { createContext, useContext, useState, useEffect } from 'react';


interface AuthContextProps {
  token: string | null;
  user: any; // Możesz tu wpisać np. { username: string } jeśli masz takie dane
  login: (newToken: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}
// 1. Tworzymy kontekst
const AuthContext = createContext<AuthContextProps | null>(null);

export const AuthProvider = ({ children } : any) => {
  // Inicjalizacja stanu tokenem z localStorage
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);

  // Funkcja logowania
  const login = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  // Funkcja wylogowania
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  // Wartości, które będą dostępne w całej aplikacji
  const value = {
    token,
    user,
    login,
    logout,
    isAuthenticated: !!token // Zwróci true jeśli token istnieje
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// 2. Eksportujemy hook do łatwego użycia
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth musi być użyty wewnątrz AuthProvider');
  }
  return context;
};