import mongoose, { trusted } from "mongoose";

const userModel = new mongoose.Schema({
    fullname: {
        type: String, 
        required: true
    }, 
    username: {
        type: String, 
        required: true, 
        unique: true, 
        trim: true
    }, 
    password: {
        type: String, 
        required: true
    }, 
    profilePicture: {
        type: String, 
        default: ""
    }, 
    isOnline: {
        type: Boolean, 
        default: false
    }
}, {timestamps: true}); 

//compile the Schema into a model 
//by creating "users" in MONGO
const User = mongoose.model("User", userModel);
export {User}
