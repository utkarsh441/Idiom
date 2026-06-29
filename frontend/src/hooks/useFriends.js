import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export const useFriends = (apiUrl) => {
  const [friends, setFriends] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const fetchFriends = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/v1/user/friends`, { withCredentials: true });
      setFriends(response.data.friends || response.data);
    } catch (err) {
      console.error("Error fetching friends list:", err);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, [apiUrl]);

  const handleSearchSubmit = async (e) => {
  e.preventDefault();
  if (!searchQuery.trim()) return;

  try {
    const response = await axios.get(`${apiUrl}/api/v1/user/search?username=${searchQuery}`, { withCredentials: true });
    
    // now backend response is accepeted
    const user = response.data.users?.[0] || response.data[0] || response.data.findUser;
    
    if (user) {
      setSearchResult(user);
      setIsPanelOpen(true);
    } else {
      
      setSearchResult(null);
      setIsPanelOpen(false); 
      
      // Pull down the explicit custom text string you typed on the backend
      const backendMessage = response.data?.message || "No user found with that username.";
      toast.info(backendMessage); 
    }
  } catch (err) {
    toast.error(err.response?.data?.message || "Could not connect to search server, try again");
  }
};
  const handleAddFriend = async (targetId, username) => {
  try {
    
    const res = await axios.post(`${apiUrl}/api/v1/user/friends/add/${targetId}`, {}, {
      withCredentials: true
    });

    if (res.data.success) { 
      //shhow friend on screen to chat with them
      setFriends((prev) => [...prev, res.data.friend]);
      toast.success(`Connected with @${username}!`);
    }
  } catch (err) {
    console.error("Failed to add friend:", err);
    toast.error(err.response?.data?.message || "Could not add friend.");
  }
};

   
  const handleRemoveFriend = async (targetId, username, selectedFriendId, setSelectedFriend) => {
    try {
      
      const res = await axios.post(`${apiUrl}/api/v1/user/friends/remove/${targetId}`, {}, {
        withCredentials: true
      });

      
      if (res.data.success) {
        
        // successful deletion = remove them
        setFriends((prev) => {
          const currentList = Array.isArray(prev) ? prev : [];
          return currentList.filter((f) => f._id !== targetId);
        });
        
        
        if (selectedFriendId === targetId && setSelectedFriend) {
          setSelectedFriend(null);
        }
        
        
        toast.success(`Removed @${username} from your friends.`);
      }
    } catch (err) {
      console.error("Failed to remove friend profile path:", err);
      toast.error("Could not process unfriend request.");
    }
  };


  return {
    friends, setFriends,
    searchQuery, setSearchQuery,
    searchResult, setSearchResult,
    isPanelOpen, setIsPanelOpen,
    handleSearchSubmit,
    handleAddFriend,
    handleRemoveFriend
  };
};