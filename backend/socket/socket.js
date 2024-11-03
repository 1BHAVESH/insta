import {Server} from "socket.io"
import express from "express"
import  http from "http"
import { Socket } from "dgram";
import exp from "constants";

const app = express()

const server = http.createServer(app);

const io = new Server(server, {
    cors:{
        origin:"http://localhost:5173",
        methods:["GET", "POST"]
    }
})

const userSocketMap = {} // this map store socket id corsponding user id => socket id

export const getReciverSocketId = (receiverId) => userSocketMap[receiverId]

io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId

    // console.log("lllllllllllllllllppppppppppp",userId)

    if(userId){
        userSocketMap[userId] = socket.id
        // console.log(`User connected user id = ${userId} socket id = ${socket.id}`);
        
    }

    io.emit("getOnlineUser", Object.keys(userSocketMap))

    socket.on("disconnect", () => {
        if(userId){
            delete userSocketMap[userId]
            // console.log(`User connected user id = ${userId} socket id = ${socket.id}`);
        }

        io.emit("getOnlineUser", Object.keys(userSocketMap))

        
    })
})

export {app, server, io};