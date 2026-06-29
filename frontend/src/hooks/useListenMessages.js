import { useEffect } from "react";
import { useSocket } from "../context/SocketContext";


export const useListenMessages = (messages, setMessages) => {
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on("newMessage", (incomingMessage) => {
      
      setMessages((prevMessages) => [...prevMessages, incomingMessage]);
    });


    return () => {
      socket.off("newMessage");
    };
  }, [socket, setMessages]);
};