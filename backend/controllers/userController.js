import User from "../models/userModel.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()
import Message from "../models/messageModel.js"; 
import Conversation from "../models/conversationModel.js"; 

const register = async(req, res) => {
    try {
        const {fullname, username, password, confirmpassword} = req.body;
        // req contains everything like cookies so req.body is used
        if(!fullname || !username || !password || !confirmpassword) {
            return res.status(400).json({message: "All fields must be filled"})
            //error 400 defines error on the frontend part 
        }
        if(password !== confirmpassword) {
            return res.status(400).json({message: "The password does not match"})
        }

        const user = await User.findOne({username});  // waits for DB response
        if(user) {
            return res.status(400).json({message: "User exists"})
        }
        const hashPassword = await bcrypt.hash(password, 12)

        await User.create({
            fullname: fullname, 
            username: username, 
            password: hashPassword, 
        }) // creates the blueprint for UserModel
        return res.status(201).json({ 
            message: "User registered successfully!" 
        });
    } catch (error) {
        console.log(error)
        res.status(404).json({
            message: "Some error occurred",  
            success: false
        })
    }
}
export {register}


const login = async(req, res) => {
    try {
        const {username, password} = req.body 
        if(!username || !password) {
            return res.status(400).json({message: "All fields are to be filled"})
        }

        const existingUser = await User.findOne({username})
        if(!existingUser) {
            return res.status(400).json({message: "The user does not exist"});
        }

        const isMatchPassword = await bcrypt.compare(password, existingUser.password);
        if(!isMatchPassword) {
            return res.status(401).json({
                message: "Incorrect password", 
                success: false // helps design frontend as it gives the result of this querying
            })
        }
        // return res.status(200).json({message: "Login Successful"}) 
        const tokenData = {
            userId: existingUser._id, 
        }

        const token = await jwt.sign(tokenData, process.env.JWT_SECRET_KEY, {expiresIn: '1d'})

        return res.status(200).cookie("logintoken", token, {
            httpOnly: true,
            maxAge: 1*24*60*60*1000, 
            sameSite: 'lax',  // strict will not accept for the localhost 8000 from different ports
            secure: false
        }).json({
            success: true, 
            message: `Logged in sucessfully\n
            Welcome back ${existingUser.fullname}`, 
            user: {
                _id: existingUser._id,
                username: existingUser.username,
                fullname: existingUser.fullname
            }
        })
        //we are chaining methods by help of res
        
    } catch (error) {
        console.log(error);
    }
}

export {login}; 

const logout = async (req, res) => {
    try {
        return res.status(200).cookie("logintoken", "", {
            maxAge: 0 
        }).json({
            success: true, 
            message: "You were successfully Logged Out"
        })
    } catch (error) {
        console.log(error)
    }
}
export {logout}

const OtherUsers = async (req, res) => {
    try {
        const loggedinUser = req.id
        const currentUser = await User.findById(loggedinUser)

        if(!currentUser || !currentUser.friends) return res.status(200).json({
            success: true, 
            friends: []
        })

        const myFriends = await User.find({_id: {
            $in: currentUser.friends}
        }).select("-password")

        return res.status(200).json(myFriends)
    }
    catch(error){
        console.log(error)
        return res.status(500).json({ message: "Internal server error" });
    }
}
export {OtherUsers}



const addFriend = async (req, res) => {
  try {
    const currentUserId = req.id; 
    const targetFriendId = req.params.id; 

    if (!targetFriendId) {
      return res.status(400).json({ success: false, message: "Target ID parameter missing." });
    }

    if (currentUserId === targetFriendId) {
      return res.status(400).json({ success: false, message: "You cannot add yourself as a friend." });
    }

    const user = await User.findById(currentUserId);
    const targetUser = await User.findById(targetFriendId);

    if (!targetUser) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    //converting to string so no erros 
    const existingFriendIds = user.friends.map(id => id.toString());

    if (existingFriendIds.includes(targetFriendId.toString())) {
      return res.status(400).json({ 
        success: false, 
        message: "You are already friends with this user." 
      });
    }

    
    await User.findByIdAndUpdate(currentUserId, { $push: { friends: targetFriendId } });
    await User.findByIdAndUpdate(targetFriendId, { $push: { friends: currentUserId } });

    return res.status(200).json({ 
      success: true, 
      message: "Friend added successfully!",
      friend: targetUser 
    });

  } catch (error) {
    console.error("Error in addFriend controller:", error);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};
export {addFriend}
const removeFriend = async (req, res) => {
  try {
    
    const currentUserId = req.id; 
    const targetFriendId = req.params.id;

    if (!currentUserId) {
      return res.status(401).json({ 
        success: false, 
        message: "Authentication failed. User session token invalid." 
      });
    }

    if (!targetFriendId) {
      return res.status(400).json({ 
        success: false, 
        message: "Target user ID parameter is missing." 
      });
    }

    
    await User.findByIdAndUpdate(currentUserId, { 
      $pull: { friends: targetFriendId } 
    });

   
    await User.findByIdAndUpdate(targetFriendId, { 
      $pull: { friends: currentUserId } 
    });

    
    return res.status(200).json({ 
      success: true, 
      message: "Friend relationship dropped successfully." 
    });

  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: "Internal server error occurred.", 
      error: error.message 
    });
  }
};

export {removeFriend} 

const searchUser = async(req, res) => {
    try {
        const {username} = req.query
        if(!username) {
            return res.status(400).json({success: false, message: "Please send a valid username"})
        }
        const findUser = await User.findOne({
            username: {$regex: `^${username}$`, $options: "i"}
        }).select("-password")

        if(!findUser) {
            return res.status(200).json({
                success: false, 
                findUser: null, 
                message: "User not found"
            })
        }
        return res.status(200).json({
            success: true, 
            findUser
        })
    } catch (error) {
        console.log(error)
        return res.status(401).json({message: "Some internal Error"})
    }
}
export {searchUser}


const getChatHistory = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;

        
        const conversations = await Conversation.find({
            participants: loggedInUserId
        })
        .populate("participants", "username fullname profilePic") // Get profile data
        .sort({ updatedAt: -1 }); 

        
        const chatHistory = await Promise.all(conversations.map(async (chat) => {
            
            const otherUser = chat.participants.find(
                (participant) => participant._id.toString() !== loggedInUserId.toString()
            );

            //latestmessage
            const latestMessage = await Message.findOne({ conversationId: chat._id })
                .sort({ createdAt: -1 });

            

            return {
                conversationId: chat._id,
                user: otherUser,
                latestMessage: latestMessage ? latestMessage.text : "No messages yet",
                lastMessageTime: latestMessage ? latestMessage.createdAt : chat.updatedAt,
                unreadNotifications: unreadCount
            };
        }));

        return res.status(200).json(chatHistory);
    } catch (error) {
        console.error("Error fetching WhatsApp-style chat history:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export {getChatHistory}

//fixed the login part re-authentication
const updateProfile = async (req, res) => {
    try {
        const currentUserId = req.id; 
        const { fullname, username, gender, profilePicture, preferredLanguage, oldPassword, newPassword } = req.body;

        
        const updateFields = {};
        if (fullname) updateFields.fullname = fullname;
        if (gender) updateFields.gender = gender;
        if (preferredLanguage) updateFields.preferredLanguage = preferredLanguage;
        if (profilePicture !== undefined) updateFields.profilePicture = profilePicture;

        
        if (username) {
            const userInstance = await User.findById(currentUserId);
            if (userInstance && userInstance.username !== username) {
                const checkUsername = await User.findOne({ username }); 
                if (checkUsername) {
                    return res.status(400).json({ success: false, message: "Username is occupied" });
                }
                updateFields.username = username;
            }
        }

        
        if (newPassword && newPassword.trim() !== "") {
            if (!oldPassword || oldPassword.trim() === "") {
                return res.status(400).json({ success: false, message: "Old password is required to save a new one." });
            }
            
            const targetUser = await User.findById(currentUserId);
            const isMatch = await bcrypt.compare(oldPassword, targetUser.password); 
            if (!isMatch) {
                return res.status(400).json({ success: false, message: "Incorrect current password" });
            }

            updateFields.password = await bcrypt.hash(newPassword, 12);
        }

        
        const updatedUser = await User.findByIdAndUpdate(
            currentUserId,
            { $set: updateFields },
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        
        const tokenData = { userId: updatedUser._id };
        const token = jwt.sign(tokenData, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });

        return res.status(200).cookie("logintoken", token, {
            httpOnly: true,
            maxAge: 1 * 24 * 60 * 60 * 1000, 
            sameSite: 'lax',  
            secure: false
        }).json({
            success: true,
            message: "Profile settings updated successfully!",
            user: updatedUser
        });
    } 
    catch (error) {
        console.error("Update Profile Controller Error:", error);
        return res.status(400).json({ success: false, message: error.message || "Invalid update operation failed." });
    }
};

export { updateProfile };
