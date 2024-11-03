import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useGetUserProfile } from "../hooks/useGetUserProfile.jsx";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { AtSign, Heart, MessageCircle } from "lucide-react";
import axios from "axios";
import { setAuthUser, setUserProfile } from "../../redux/authSlice.js";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";

function Profile() {
  const navigate = useNavigate();
  const params = useParams();
  useGetUserProfile(params.id);
  const dispatch = useDispatch();
  const { userProfile, user } = useSelector((store) => store.auth);

  const isLoggedin = user._id === userProfile._id;
  const isFollowing = user.followings.includes(userProfile._id);
  const [activeTab, setActiveTab] = useState("Posts");

  const handleActiveTab = (tab) => {
    setActiveTab(tab);
  };

  const displayPost =
    activeTab === "Posts" ? userProfile?.posts : userProfile?.bookmarks;

  const followHandler = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/v1/users/followOrUnfollow/${userProfile?._id}`,
        { withCredentials: true }
      );
      dispatch(setAuthUser(res.data.user));
      dispatch(setUserProfile(res.data.targetedUser));
    } catch (error) {
      console.log(error);
    }
  };

  const unfollowHandler = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/v1/users/followOrUnfollow/${userProfile?._id}`,
        { withCredentials: true }
      );
      dispatch(setAuthUser(res.data.user));
      dispatch(setUserProfile(res.data.targetedUser));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center mx-auto max-w-5xl pl-10">
      <div className="flex flex-col gap-20 p-8">
        <div className="grid grid-cols-2 gap-5">
          <section className="flex items-center justify-center">
            <Avatar className="w-32 h-32">
              <AvatarImage src={userProfile?.profilePicture} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </section>
          <section>
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-5">
                <span>{userProfile.username}</span>
                {isLoggedin ? (
                  <>
                    <Link to="/account/edit">
                      <Button variant="secondary" className="hover:bg-gray-200">
                        Edit
                      </Button>
                    </Link>
                    <Button variant="secondary" className="hover:bg-gray-200">
                      View Archive
                    </Button>
                    <Button variant="secondary" className="hover:bg-gray-200">
                      Tools
                    </Button>
                  </>
                ) : isFollowing ? (
                  <>
                    <Button
                      onClick={unfollowHandler}
                      variant="secondary"
                      className="h-8"
                    >
                      Unfollow
                    </Button>
                    <Button
                      onClick={() => navigate("/chat")}
                      variant="secondary"
                      className="h-8"
                    >
                      Message
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={followHandler}
                    className="bg-[#0095f6] hover:bg-[#3192d2] h-8"
                  >
                    Follow
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-4">
                <p>
                  <span className="font-semibold">
                    {userProfile?.posts.length}
                  </span>{" "}
                  posts{" "}
                </p>
                
                <Popover>
                    <PopoverTrigger asChild>
                      <span className="font-semibold cursor-pointer">
                        {userProfile?.followers?.length} Followers
                      </span>
                    </PopoverTrigger>
                  {
                    userProfile?.followers?.length > 0 &&   <PopoverContent>
                    <div>
                      {userProfile?.followers?.map((user) => (
                        <div
                          className="flex items-center gap-3"
                          key={user._id}
                        >
                          <Avatar>
                            <AvatarImage
                              src={user?.profilePicture}
                            />
                             <AvatarFallback>CN</AvatarFallback>
                          </Avatar>
                          <p className="text-sm">
                            <span className="font-bold">
                              {user?.username}
                            </span>
                          </p>
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                  }
                  </Popover>
                <p>
                 <Popover>
                  <PopoverTrigger asChild>

                    <span className="font-semibold cursor-pointer">{userProfile.followings.length} Followings </span>

                  </PopoverTrigger>
                  {
                    userProfile?.followings.length > 0 && <PopoverContent>
                    <div>
                      {
                        userProfile.followings.map((user) => (
                          <div className="flex gap-3" key={user._id}>

                            <Avatar>
                              <AvatarImage src={user?.profilePicture} />
                              <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <p>{user?.username}</p>
                            </div>
                        ))
                      }
                    </div>
                  </PopoverContent>
                  }
                 </Popover>
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-semibold">
                  {userProfile?.bio || "bio here..."}
                </span>
                <Badge className="w-fit" variant="secondary">
                  <AtSign />
                  <span className="pl-2">{userProfile?.username}</span>
                </Badge>
                <span>🤯 Learn code with style</span>
                <span>🤯 Turing code into fun</span>
                <span>🤯 DM for collaboration</span>
              </div>
            </div>
          </section>
        </div>
        <div className="border-t border-t-gray-500">
          <div className="flex items-center justify-center gap-10 text-sm">
            <span
              className={`py-3 cursor-pointer ${
                activeTab === "Posts" ? "font-bold" : ""
              }`}
              onClick={() => setActiveTab("Posts")}
            >
              Posts
            </span>
            <span
              className={`py-3 cursor-pointer ${
                activeTab === "Saved" ? "font-bold" : ""
              }`}
              onClick={() => setActiveTab("Saved")}
            >
              Saved
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1">
            {displayPost?.map((post) => (
              <div key={post._id} className="relative group cursor-pointer">
                <img
                  src={post.image}
                  className="rounded-sm my-2 w-full aspect-square object-cover"
                />
                <div className="absolute rounded inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center text-white space-x-4">
                    <button className="flex items-center gap-2 bg-transparent hover:text-gray-300">
                      <Heart />
                      <span>{post?.likes?.length}</span>
                    </button>
                    <button className="flex items-center gap-2 bg-transparent hover:text-gray-300">
                      <MessageCircle />
                      <span>{post?.comments?.length}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
