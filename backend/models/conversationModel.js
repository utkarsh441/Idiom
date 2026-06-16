import mongoose from "mongoose";

const conversationModel = mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
    }], 
    messages: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Message"
    }]
}, {timestamps: true})

const Conversation = mongoose.model("Conversation", conversationModel) 
//the line inside the "" is what mongoose uses to registr
export {Conversation}