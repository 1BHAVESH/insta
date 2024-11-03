import express, { urlencoded } from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors"
import connecttoDB from "./utils/db.js"
import userRoute from "./routes/userRoutes.js"
import postRoute from "./routes/postRoutes.js"
import messageRoute from "./routes/meaage.js"
import {app, server, io} from "./socket/socket.js"
import dotenv from "dotenv";
dotenv.config({});



const PORT = 8080;

app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({extended:true}));

const corsOption = {
    origin:"http://localhost:5173",
    credentials:true,
}

app.use(cors(corsOption));

app.get("/", (req, res) => {
   return res.status(200).json({
        mesaage: "i am coming from backend",
        success:true,
    })
})

app.use("/api/v1/users", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/message", messageRoute);

server.listen(PORT, () =>{
    console.log(`server listing to this port ${PORT}`);
    connecttoDB();
    console.log(mongoose.modelNames())
})