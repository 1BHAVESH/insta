import {
  Heart,
  Home,
  HomeIcon,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
} from "lucide-react";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "./../../redux/authSlice";
import CreatePost from "./CreatePost";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { setLikeNotify } from "../../redux/rtmLikeAndDislikeSlice.js";



function LeftSidebar() {
  const {likeNotify} = useSelector(store => store.like)
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const {user} = useSelector(store=> store.auth);
   
  const logOutHandler = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/v1/users/logout",
        {
          headers: {
            "Content-Type": "application/json",
          },

          withCredentials: true,
        }
      );

      if(res.data.success){
        dispatch(setAuthUser(null))
        navigate("/login")
      }

      toast.success(res.data.message);
    } catch (error) {
        console.log(error.response.data.message);
        toast.error(error.response.data.message);
    }
  };

  const sidebarHandler = (text) => {

   if(text == "Logout") logOutHandler()

    if(text == "Create"){
      setOpen(true)
    }

    if(text == "Profile"){
      navigate(`/profile/${user._id}`)
    }

    if(text == "Home") navigate("/")

      if(text == "Messages") navigate("/chat")

  }

  const notifyHandler = (param) => {
    console.log("Hello");
    if(param == true)
    dispatch(setLikeNotify({ type: "" }));
};

  const SideBarItems = [
    { icon: <Home />, text: "Home" },
    { icon: <Search />, text: "Search" },
    { icon: <TrendingUp />, text: "Tranding" },
    { icon: <MessageCircle />, text: "Messages" },
    { icon: <Heart />, text: "Notification" },
    { icon: <PlusSquare />, text: "Create" },
    {
      icon: (
        <Avatar className="w-7 h-7">
          <AvatarImage src={user?.profilePicture} alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
    { icon: <LogOut />, text: "Logout" },
  ];
  return (
    <div className="fixed top-0 z-10 left-0 px-4 border-r border-green-300 w-[16%] h-screen">
      <div className="flex flex-col">
       <img src="./public/Logo-Instagram.png" className="w-[9rem] h-[5rem]"  />
        <div>
          {SideBarItems.map((item, index) => {
            return (
              <div
                onClick={() => sidebarHandler(item.text)}
                key={index}
                className="flex items-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3 "
              >
                {item.icon}
                <span>{item.text}</span>
                {
                  item.text =="Notification" && likeNotify.length > 0 && (
                    <Popover  >
                      <PopoverTrigger  asChild>
                        <Button  size="icon" className="rounded-full h-5 w-5 absolute bg-red-600 bottom-6 left-6">{likeNotify.length}</Button>
                      </PopoverTrigger>
                      <PopoverContent onClick={() => notifyHandler(1)}>
                        <div>
                          {
                            likeNotify.length === 0 ? (<p>No new Notification</p>) :( 
                              likeNotify.map((notification, index) => {
                                return(
                                  <div className="flex items-center gap-3" key={notification.userId}>
                                    <Avatar>
                                      <AvatarImage src={notification.userDetail?.profilePicture} />
                                    </Avatar>
                                    <p className="text-sm"><span className="font-bold">{notification.userDetail?.username} </span>liked your post</p>
                                    </div>
                                )
                              })
                            )
                          }
                        </div>
                      </PopoverContent>
                    </Popover>
                  )
                }

                {/* {
                  item.text == "Messages" && 
                } */}
              </div>
            );
          })}
        </div>
      </div>
      <CreatePost open={open} setOpen={setOpen}/>
    </div>
  );
}

export default LeftSidebar;
