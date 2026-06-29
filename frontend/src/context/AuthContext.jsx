import React, { createContext, useContext, useState } from 'react';
import axios from 'axios'; 

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null); 

  const login = async (username, password) => {
    try {
      const response = await axios.post(
        'http://localhost:8000/api/v1/user/login', 
        { username, password },
        { withCredentials: true } 
      );

      if (response.data && response.data.user) {
        setIsAuthenticated(true);
        setUser(response.data.user); 
        console.log("✅ FRONTEND ID VERIFICATION IN CONTEXT:", response.data.user._id);
      } else if (response.data && response.data.success) {
        setIsAuthenticated(true);
        setUser(response.data); 
      }
      return response.data;
    } catch (error) {
      console.error("Axios login engine failure:", error);
      throw error; 
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);