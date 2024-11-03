import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const SuggestedUser = () => {
  const { suggestedUsers } = useSelector((store) => store.auth);
//   console.log(suggestedUsers);
  return (
    <div className="my-10 ">
      <div className="flex items-center justify-between text-sm gap-6">
        <h1 className="font-semibold text-gray-600">Suggested User For You</h1>
        <span className="font-medium cursor-pointer">See All</span>
      </div>

      {suggestedUsers?.map((user) => (
        <div key={user._id} className="flex items-center justify-center gap-20">
          <div className="flex items-center  my-5  gap-2">
            <Link to={`/profile/${user._id}`}>
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
          <span className="mb-5 text-[#1285ff] cursor-pointer">Follow</span>
        </div>
      ))}
    </div>
  );
};

export default SuggestedUser;
