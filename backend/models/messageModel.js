import mongoose from "mongoose";

const messageModel = mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true
    }, 
    receiverId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true
    }, 
    message: {
        type: String, 
        required: true
    }, 
    translation: {
        targetLanguage: { 
            type: String, 
            enum: ["English", "French", "Spanish", "Portuguese", "German", "Italian", "Swahili"], 
            default: null
        },
        translatedText: { 
            type: String, 
            default: null
        }
    }

}, {timestamps: true})
const Message = mongoose.model("Message", messageModel)

export default Message