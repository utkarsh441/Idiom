import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSocket } from '../context/SocketContext'; 

export const useChat = (API_URL, currentUserId, selectedFriend, setFriends) => {
  const [chatMessages, setChatMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const { socket } = useSocket();

  
  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!selectedFriend?._id) return;
      try {
        const res = await axios.get(`${API_URL}/api/v1/message/${selectedFriend._id}`, {
          withCredentials: true,
        });
        
        
        if (Array.isArray(res.data)) {
          setChatMessages(res.data);
        } else if (res.data && Array.isArray(res.data.messages)) {
          setChatMessages(res.data.messages);
        } else if (res.data && Array.isArray(res.data.conversation)) {
          setChatMessages(res.data.conversation);
        } else {
          setChatMessages([]);
        }
      } catch (err) {
        console.error("Failed to load conversation logs:", err);
        setChatMessages([]);
      }
    };
    fetchChatHistory();
  }, [selectedFriend, API_URL]);

  //sidebar is maintained
  useEffect(() => {
    if (!socket) return;

    socket.on("newMessage", (incomingMessage) => {
      
      if (selectedFriend && incomingMessage.senderId === selectedFriend._id) {
        
        setChatMessages((prev) => [...(Array.isArray(prev) ? prev : []), incomingMessage]);
      } else {
       
        setFriends((prevFriends) => {
          const currentList = Array.isArray(prevFriends) ? prevFriends : [];
          
          // Check if this sender already exists in your sidebar UI list
          const senderExists = currentList.some((f) => f._id === incomingMessage.senderId);

          if (senderExists) {
            // If they exist push them up
            const updatedList = currentList.map((f) =>
              f._id === incomingMessage.senderId 
                ? { ...f, hasUnread: true, lastMessage: incomingMessage.message } 
                : f
            );
            
            return [
              updatedList.find(f => f._id === incomingMessage.senderId),
              ...updatedList.filter(f => f._id !== incomingMessage.senderId)
            ];
          } else {
            // If stranger inject to top
            const newChatListItem = {
              _id: incomingMessage.senderId,
              // Use username sent from backend socket, otherwise provide a clear fallback string
              username: incomingMessage.senderUsername || "New Message Received", 
              hasUnread: true,
              lastMessage: incomingMessage.message
            };
            
            
            return [newChatListItem, ...currentList];
          }
        });
      }
    });

    return () => {
      socket.off("newMessage");
    };
  }, [socket, selectedFriend, setFriends]);

  
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedFriend?._id) return;
    
    console.log("currentUserId:", currentUserId);
    console.log("Friendid:", selectedFriend._id);

    const provisionalPayload = {
      _id: Date.now().toString(),
      senderId: currentUserId,
      receiverId: selectedFriend._id,
      message: messageText,
    };

    
    setChatMessages((prev) => [...(Array.isArray(prev) ? prev : []), provisionalPayload]);
    
    const textSnapshot = messageText;
    setMessageText('');

    try {
      await axios.post(
        `${API_URL}/api/v1/message/send/${selectedFriend._id}`,
        { message: textSnapshot },
        { withCredentials: true }
      );
    } catch (err) {
      console.error("HTTP network dispatch failure:", err);
    }
  };

  return {
    chatMessages,
    messageText,
    setMessageText,
    handleSendMessage,
  };
};