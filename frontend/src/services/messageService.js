import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/v1/message';

export const messageService = {
  
  sendMessage: async (receiverId, messageText) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/send/${receiverId}`,
        { message: messageText },
        { withCredentials: true } 
      );
      return response.data; 
    } catch (error) {
      console.error("Error in messageService.sendMessage:", error);
      throw error;
    }
  },

  //fetches message from friend
  getMessages: async (friendId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/get/${friendId}`,
        { withCredentials: true }
      );
      return response.data; 
    } catch (error) {
      console.error("Error in messageService.getMessages:", error);
      throw error;
    }
  }
};