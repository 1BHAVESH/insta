import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Signup from './components/Signup'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Mainlayout from './components/Mainlayout'
import Home from './components/Home'
import Login from './components/Lofin'
import Profile from './components/Profile'
import EditProfile from './components/EditProfile'
import ChatPage from './components/ChatPage'
import { io } from 'socket.io-client'
import { useDispatch, useSelector } from 'react-redux'
import { setSocket } from '../redux/socketSlice.js'
import { setOnlineUser } from '../redux/chatSlice.js'
import { setLikeNotify, setMssg } from '../redux/rtmLikeAndDislikeSlice.js'

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element:<Mainlayout />,
    children:[
      {
        path:"/",
        element: <Home />
      },
      {
        path:"/profile/:id",
        element: <Profile />
      },
      {
        path: "/account/edit",
        element:<EditProfile />
      },
      {
        path: "/chat",
        element:<ChatPage />
      }
    ]
  },
  {
    path:"/login",
    element:<Login />
  },
  {
    path:"/signup",
    element:<Signup />
  }
])

function App() {
 
  const {user} = useSelector(store => store.auth)
  const {socket} = useSelector(store => store.socketio)
  const {onlineUsers} = useSelector(store => store.chat)
  const dispatch = useDispatch();
  useEffect(() => {

    if(user){
      const socketio = io("http://localhost:8080", {
        query:{
          userId: user._id
        },
        transports:["websocket"]
      })

      dispatch(setSocket(socketio))

      console.log(onlineUsers)

      // listen all the events
      
      socketio.on("getOnlineUser", (onlineUsers) => {
        dispatch(setOnlineUser(onlineUsers))
      })

      socketio.on("notification", (notification) => {
        console.log(notification)
         dispatch(setLikeNotify(notification))
      })

      socketio.on("msg", (msg)=> {
        console.log("Socket connected!");
        console.log(msg)
        dispatch(setMssg(msg))
      })

      return () => {
        socketio.close();
        dispatch(setSocket(null));
      }
    }else if(socket){

      return () => {
        socket.close();
        dispatch(setSocket(null));
      }

    }

  },[user, dispatch])

  return (
   <>
  <RouterProvider router={browserRouter} />
   </>
  )
}

export default App
