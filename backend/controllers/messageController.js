import Message from "../models/messageModel.js";
import Conversation from "../models/conversationModel.js";
import User from "../models/userModel.js"; 
import { getReceiverSocketId, io } from "../sockets/socket.js"; 
import { translateMessage } from "../services/geminiServices.js"; 

const sendMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const { message } = req.body; 

        if (!message) {
            return res.status(400).json({ success: false, message: "Message cannot be empty" });
        }

        const sender = await User.findById(senderId);
        const receiver = await User.findById(receiverId);
        if (!receiver) {
            return res.status(404).json({ success: false, message: "Receiver account not found" });
        }

        let translationPayload = {
            targetLanguage: null,
            translatedText: null
        };

        // saves time only call if their languages are not same
        if (sender.preferredLanguage !== receiver.preferredLanguage) {
            
            const aiTranslation = await translateMessage(message, receiver.preferredLanguage);
            
            if (aiTranslation) {
                translationPayload = {
                    targetLanguage: receiver.preferredLanguage,
                    translatedText: aiTranslation
                };
            }
        }

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId]
            });
        }
        const newMessage = await Message.create({
            senderId: senderId, 
            receiverId: receiverId,  
            message: message,
            translation: translationPayload 
        });  

        conversation.messages.push(newMessage._id);
        await conversation.save();  
        const receiverSocketId = getReceiverSocketId(receiverId);
    
        if (receiverSocketId) {
            
            io.to(receiverSocketId).emit("newMessage", newMessage);
            console.log("Reciever Online");
        } else {
            console.log("Reciever Offline");
        }

        return res.status(201).json({
            success: true, 
            newMessage 
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const getMessage = async (req, res) => {
    try {
        const myId = req.id;
        const myFriendId = req.params.id;
        
        const conversation = await Conversation.findOne({
            participants: { $all: [myId, myFriendId] }
        }).populate("messages");

        if (!conversation) {
            return res.status(200).json({ success: true, messages: [] });
        }

        return res.status(200).json({
            success: true,
            messages: conversation.messages
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export { sendMessage, getMessage };