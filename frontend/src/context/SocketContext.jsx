import React, { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext.jsx'; 

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  
  
  const { user, isAuthenticated } = useAuth(); 

  useEffect(() => {
    // Check both possible object locations to securely read the unique ID string
    const actualUserId = user?._id || user?.user?._id || user?.id;

    if (isAuthenticated && actualUserId) {
      console.log("🔌 SUCCESS: SOCKET INITIATING FOR ID:", actualUserId);
      
      const newSocket = io('http://localhost:8000', {
        query: { userId: actualUserId },
        withCredentials: true
      });

      setSocket(newSocket);

      newSocket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      return () => {
        newSocket.close();
        setSocket(null);
      };
    } else {
      console.log("⚠️ SOCKET TRAPPED: Auth state updated but no clean ID found yet. User object looks like:", user);
    }
  }, [user, isAuthenticated]); // 

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};