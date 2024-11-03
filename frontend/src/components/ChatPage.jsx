import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { setSelectedUser } from "../../redux/authSlice.js";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { MessageCircleCode } from "lucide-react";
import Messages from "./Messages";
import axios from "axios";
import { setMsg } from "../../redux/chatSlice.js";

const ChatPage = () => {
  const [message, setMessage] = useState("");
  const { user, suggestedUsers, selectedUser } = useSelector(
    (store) => store.auth
  );

  const { onlineUser,msg } = useSelector((store) => store.chat);
  const dispatch = useDispatch();
  const isOnline = true;

  const setMsgHandler = async (reciverId) => {
    try {
      const res = await axios.post(
        `http://localhost:8080/api/v1/message/send/${reciverId}`,
        { message },
        {
          headers: {
            "Content-Type": "application/json",
          },

          withCredentials: true,
        }
      );

      if(res.data.success){

        console.log(res.data)

        dispatch(setMsg([...msg, res.data.newMessage]))
        setMessage("")

      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    return () => {
      dispatch(setSelectedUser(""))
    }
  },[])

  return (
    <div className="flex ml-[16%] h-screen">
      {/* Left Side Suggested Users List */}
      <section className="w-[25%] p-3 border-r border-gray-300">
        <h1 className="font-bold mb-4 text-xl">{user?.username}</h1>
        <hr className="mb-3 border-gray-300" />
        <div className="overflow-y-auto h-[80vh]">
          {suggestedUsers.map((user) => {
            const isOnline = onlineUser.includes(user?._id); // isOnline ko yaha calculate karein

            return (
              <div
                key={user._id}
                onClick={() => dispatch(setSelectedUser(user))}
                className="flex gap-3 items-center p-3 hover:bg-gray-300 cursor-pointer"
              >
                <Avatar>
                  <AvatarImage src={user.profilePicture} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium">{user?.username}</span>
                  <span
                    className={`text-xs font-bold ${
                      isOnline ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {isOnline ? "online" : "offline"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Chat Section */}
      {selectedUser ? (
        <section className="w-screen border-l border-gray-300 flex flex-col h-full">
          <div className="flex items-center gap-3 px-3 py-2 border-b border-b-gray-600 sticky top-0 bg-white z-10">
            <Avatar>
              <AvatarImage src={selectedUser?.profilePicture} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex">
              <span>{selectedUser?.username}</span>
            </div>
          </div>

          <Messages selectedUser={selectedUser} />

          <div className="flex items-center p-4 border-t border-gray-300">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              type="text"
              className="flex-1 mr-2 focus-visible:ring-transparent"
              placeholder="Send Message..."
            />
            <Button onClick={() => setMsgHandler(selectedUser?._id)}>
              Send
            </Button>
          </div>
        </section>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center mx-auto">
          <MessageCircleCode className="w-32 h-32 my-4" />
          <h1>Your Message</h1>
          <span>Send a message to start a chat</span>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
