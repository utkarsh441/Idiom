import express from 'express'
import dotenv from 'dotenv'
import { connectDB } from './config/database.js'
import userRoute from "./routes/userRoute.js"
dotenv.config() //loads variables from .env file to process.env
//where process.env is an object of NODE JS

const app = express()
app.use(express.json()); // middleware helps decipher the json data coming 

const PORT = process.env.PORT || 8000

app.use("/api/v1/user", userRoute) // named it userRoute for defining actions 

app.listen(PORT, () => {
    connectDB();
    console.log(`Server is listening at port ${PORT}`)
})


