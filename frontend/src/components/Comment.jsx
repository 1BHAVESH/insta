import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Avatar } from "./ui/avatar";
import { AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import ShowComment from "./ShowComment";
import axios from "axios";
import { setPost } from "../../redux/postSlice.js";
import { toast } from "sonner";

function Comment({ open, setOpen, postIMage, post }) {

  //  console.log(post)

  const dispatch = useDispatch()
  const {posts} = useSelector(store => store.posts)

  // const [input, setInput] = useState("");
  const [comment, setComment] = useState(post.comments)
  const [text, setText] = useState("");

  const changeEventHandler = (e) => {

     // console.log(e.target);

     const inputText = e.target.value;

     // console.log(inputText.trim());
     // console.log(inputText);
 
     if (inputText == "") {
       setText("");
     } else {
       setText(inputText);
     }
   
  }

  const coomentHandler = async() => {

    try {

      console.log(text)
      const res = await axios.post(`http://localhost:8080/api/v1/post/${post._id}/create_comment`, {text}, {
        headers: {
          "Content-Type" : "application/json"
        }, 
        withCredentials: true
      })
    
      console.log(res.data)
      if(res.data.success){
    
        const updatedComment = [...comment, res.data.comment];
    
        setComment(updatedComment);
    
        const updatedPostData = posts.map((p) =>
           p._id === post._id ? {
    
            ...p,
            comments: [...p.comments, res.data.comment]
    
    
           } : p)

           console.log(updatedPostData)
    
           dispatch(setPost(updatedPostData));
    
           toast.success(res.data.message)

           console.log(posts)
  
           setText("")
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div>
      <Dialog open={open}>
        <DialogContent
          onInteractOutside={() => setOpen(false)}
          className="p-0 max-w-5xl"
        >
          <div className="flex flex-1">
            <div className="w-1/2">
              <img
                src={post.image}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-1/2 flex flex-col justify-between">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                <Link>
                  <Avatar>
                    <AvatarImage src={post?.author?.profilePicture} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link className="font-semibold text-xs">{post?.author?.username}</Link>
                  {/* <span>Bio here.....</span> */}
                </div>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <MoreHorizontal className="cursor-pointer"/>
                    </DialogTrigger>
                    <DialogContent className="flex flex-col items-center text-center">
                      <div className="w-full cursor-pointer text-[#ED4956] font-bold border-b-4">Unfollow</div>
                      <div className="w-full cursor-pointer font-bold line">Add to fev</div>
                    </DialogContent>
                  
                </Dialog>
              </div>
              <hr class="h-[0.1px] bg-gray-500 border-none my-4" />
              <div className="flex-1 overflow-y-auto max-h-96 p-4">
                {
                  post?.comments.map((comment) => <ShowComment key={comment._id} comment = {comment} />)
                }
                Comments
              </div>
              {/*yha div video me btaya hai baad me dekhte hai kya krna hai */}
              <div className="p-4 flex items-center gap-2">
                <input type="text" placeholder="Add a Comment..."  onChange={changeEventHandler} className="w-full outline-none border border-gray-300 p-3 rounded" />
                <Button variant="outline" className="border-black text-blue-800" onClick={coomentHandler}>send</Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Comment;
