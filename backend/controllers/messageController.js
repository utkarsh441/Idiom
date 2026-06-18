import Message from "../models/messageModel.js";
import Conversation from "../models/conversationModel.js"

const sendMessage = async(req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id
        const {message} = req.body
        if(!message) {
            return res.status(400).json({
                success: false, 
                message: "Message cannot be empty"
            })
        }
        let conversation = await Conversation.findOne({
            participants: {$all : [senderId, receiverId]}
        })
        if(!conversation) {
            conversation = await Conversation.create({
                participants : [senderId, receiverId]
            })
        }
        //creating 
        const newMessage = await Message.create({
            senderId: senderId, 
            receiverId: receiverId,  
            message: message
        })  
        conversation.messages.push(newMessage._id) // modifies the conversation array 
        await conversation.save() // saves the array into Mongo DB

        return res.status(201).json({
            success: true, 
            newMessage 
        })

    } catch (error) {
        console.log(error)
    }
}
export {sendMessage}


const getMessage = async (req, res) => {
    try {
        const myId = req.id
        const myFriendId = req.params.id
        const conversation = await Conversation.findOne({
        participants: {$all: [myId, myFriendId]}
        }).populate("messages")
        //populate helps us get the message instead of their ID's
        if(!conversation) {
            return res.status(200).json({
                success: true, 
                messages: []
            })
        }
        //maybe we are texting a new person who we never texted
        return res.status(200).json({
            success: true,
            messages: conversation.messages
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export {getMessage}