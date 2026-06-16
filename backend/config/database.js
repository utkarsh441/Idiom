import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

 //async is always the function neveer the constant 
 const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000
        })
        console.log(`MongoDB connected`)
    } 
    catch (error) {
        console.log(error)
    }

}
export {connectDB}