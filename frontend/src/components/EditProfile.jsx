import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { setAuthUser } from "../../redux/authSlice.js";

const EditProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [loader, setLoader] = useState(false);
  const imageRef = useRef();
  const { user } = useSelector((store) => store.auth);
  const [input, setInput] = useState({
    profilePhoto: user?.profilePicture,
    bio: user?.bio,
    gender: user?.gender
  })

  const fileChangeHandler = (e) => {

    const file = e.target.files?.[0]

    console.log("xxxxxxxxxxx", file)

    if(file){
      setInput({...input, profilePhoto:file})
    }
  }

  const selectChangeHandler= (value) => {

    setInput({...input, gender: value})
  }

  const editHandler = async() => {

    console.log(input)

    try {
      setLoader(true)

      const formData = new FormData()

      formData.append("bio", input.bio)
      formData.append("gender", input.gender)

      if(input.profilePhoto){
        formData.append("profilePicture", input.profilePhoto)
        
      }

      const res = await axios.post("http://localhost:8080/api/v1/users/profile/edit", formData, {
        headers: {
             'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
    })

    if(res.data.success){
      setInput({...input, profilePhoto: res.data.user?.profilePicture});
      const updatedData = {
        ...user,
        bio: res.data.user?.bio,
        gender: res.data.user?.gender,
        profilePicture: res.data.user?.profilePicture
      }
      

      dispatch(setAuthUser(updatedData))
      console.log("/\/\/\/]\/\/\/",res.data.user.profilePicture)
      toast.success(res.data.message)
      navigate(`/profile/${user?._id}`)

    }
    } catch (error) {
      console.log(error)
     toast.error(error.response.data.message)
    }finally{
      setLoader(false)
    }
  }
  return (
    <div className="flex max-w-2xl mx-auto pl-10">
      <section className="flex flex-col w-full gap-6">
        <h1 className="font-bold text-xl">Edit Profile</h1>
        <div className="flex items-center justify-between bg-gray-300 rounded-xl p-4 gap-2">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={user?.profilePicture} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            <div>
              <h1 className="font-bold text-sm">{user?.username}</h1>
              <span className="text-gray-600 text-sm">
                {user?.bio || "Bio here..."}
              </span>
            </div>
          </div>
          <input ref={imageRef} onChange={fileChangeHandler} type="file" className="hidden" />
          <Button onClick={() => imageRef?.current.click()} className="bg-[#0095f6] h-8 hover:bg-gray-500">Change Photo</Button>
        </div>
        <div className="my-3">
          <h1 className="font-semibold">Bio here...</h1>
          <Textarea value={input.bio} onChange={(e) => setInput({...input, bio: e.target.value})} className="focus-visible:ring-transparent" name="bio" />
        </div>

        <div className="my-3">
          <h1 className="font-semibold">gender</h1>
          <Select defaultValue={input.gender} onValueChange={selectChangeHandler}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a gender" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Gender</SelectLabel>
          <SelectItem value="male">Male</SelectItem>
          <SelectItem value="female">Female</SelectItem>
          
        </SelectGroup>
      </SelectContent>
    </Select>
        </div>
        <div className="flex items-center justify-center">
          {
           loader ? (
            <Button className="bg-[#0095f6] h-8 hover:bg-gray-500 w-fit">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait...
            </Button>
           ) : (
            <Button onClick={editHandler} className="bg-[#0095f6] h-8 hover:bg-gray-500 w-fit">Submit</Button>
           )
          }
         
        </div>

      </section>
    </div>
  );
};

export default EditProfile;
