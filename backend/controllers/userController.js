import User from "../models/userModel.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

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
            return res.status(400).json({messgae: "User exists"})
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
            sameSite: 'strict'
        }).json({
            sucess: true, 
            message: `Logged in sucessfully\n
            Welcome back ${existingUser.fullname}`
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

// - X-X-X--X-X-X--X-X-X-X-X-X-X-X-X-X-X-

const addFriend = async(req, res) => {
    try {
        const loggedinUser = req.id
        const { friendId } = req.body

        if(loggedinUser == friendId) {
            return res.status(401).json({message: "You cannot add yourself as a friend"})
        }
        
        const friendUser = await User.findById(friendId)
        if(!friendUser) {
            return res.status(400).json({success, message: "User not found"})
        }
        const currentUser = await User.findById(loggedinUser)
        if(currentUser.friends.includes(friendId)) {
            return res.status(400).json({success: false, message: "You are already friends."})
        }
        await User.findByIdAndUpdate(loggedinUser, { $addToSet: { friends: friendId }});

    } catch (error) {
        console.log(error)
        return res.status(500).json({message: "Internal server error"})
    }
}
export {addFriend}


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
            return res.status(404).json({
                success: false, 
                message: "User not found"
            })
        }
        return res.status(200).json({success: true}, findUser)
    } catch (error) {
        console.log(error)
        return res.status(401).json({message: "Some internal Error"})
    }
}
export {searchUser}