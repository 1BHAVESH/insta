import React from "react";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import SuggestedUser from "./SuggestedUser";

function RightSideBar() {
  const { user } = useSelector((store) => store.auth);

  // console.log(user);
  return (
    <div className="my-10 pr-[5rem]">
      <div className="flex items-center gap-5">
        <Link>
          <Avatar>
            <AvatarImage src={user?.profilePicture} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Link>

        <div>
          <h1 className="font-semibold text-sm">{user?.username}</h1>
          <span className="text-gray-600 text-sm">
            {user?.bio || "Bio here..."}
          </span>
        </div>
      </div>
      <SuggestedUser />
    </div>
  );
}

export default RightSideBar;
