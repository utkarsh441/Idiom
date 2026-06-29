import express from 'express'
import dotenv from 'dotenv'
import { connectDB } from './config/database.js'
import userRoute from "./routes/userRoute.js"
import messageRoute from "./routes/messageRoute.js"
import cors from "cors"
import cookieParser from 'cookie-parser'
import { app, server } from './sockets/socket.js'
dotenv.config() //loads variables from .env file to process.env
//where process.env is an object of NODE JS

// const app = express() // commented as now we have websockets

// Allows your React frontend to talk to this backend
// Allows the browser to pass cookies/sessions back and forth
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
//Middlewares
app.use(express.json()); // middleware helps decipher the json data coming 
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

const PORT = process.env.PORT || 8000

app.use("/api/v1/user", userRoute) // named it userRoute for defining actions 
app.use("/api/v1/message", messageRoute)

server.listen(PORT, () => {
    connectDB();
    console.log(`Server is listening at port ${PORT}`)
})


