import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { FaHeart } from "react-icons/fa";
import { Button } from "./ui/button";
import { CiHeart } from "react-icons/ci";
import Comment from "./Comment";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { setPost } from "../../redux/postSlice.js";
import { setAuthUser } from "../../redux/authSlice.js";

function Post({ post }) {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.posts);

  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);
  const [countLike, setCountLike] = useState(post.likes.length);
  const [comment, setComment] = useState(post.comments);
  const [isBookmarked, setIsBookmarked] = useState(user?.bookmarks?.includes(post._id) || false);

  const changeEventHandler = (e) => {
    setText(e.target.value.trim());
  };

  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:8080/api/v1/post/${post._id}/delete_post`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedPost = posts.filter((postItem) => postItem._id !== post._id);
        dispatch(setPost(updatedPost));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  const likeAndDislikeHandler = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/v1/post/${post._id}/like_or_dislike`,
        { withCredentials: true }
      );
      if (res.data.success) {
        setLiked(!liked);
        setCountLike(liked ? countLike - 1 : countLike + 1);

        const updatedPost = posts.map((p) =>
          p._id === post._id
            ? {
                ...p,
                likes: liked
                  ? p.likes.filter((id) => id !== user._id)
                  : [...p.likes, user._id],
              }
            : p
        );

        dispatch(setPost(updatedPost));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  const commentHandler = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8080/api/v1/post/${post._id}/create_comment`,
        { text },
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );

      if (res.data.success) {
        const updatedComment = [...comment, res.data.comment];
        setComment(updatedComment);

        const updatedPostData = posts.map((p) =>
          p._id === post._id
            ? { ...p, comments: [...p.comments, res.data.comment] }
            : p
        );

        dispatch(setPost(updatedPostData));
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      toast.error("An error occurred while commenting");
    }
  };

  const bookmarkHandler = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/post/${post._id}/bookmark`,
        { withCredentials: true }
      );
  
      if (response.data.success) {
        const userData = response.data.user;
        dispatch(setAuthUser(userData));
        setIsBookmarked(userData.bookmarks.includes(post._id));
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  useEffect(() => {
    setIsBookmarked(user?.bookmarks?.includes(post._id));
  }, [user?.bookmarks]);

  return (
    <div className="my-8 w-full max-w-sm mx-auto">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Avatar className="w-10 h-10">
            <AvatarImage src={post.author?.profilePicture} alt="post_image" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <h1>{post.author.username}</h1>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center text-sm text-center">
            {user?._id !== post.author._id && (
              <Button variant="ghost" className="w-fit text-blue-800 font-bold">
                Unfollow
              </Button>
            )}
            <Button variant="ghost" className="w-fit text-blue-800 font-bold" onClick={bookmarkHandler}>
              Bookmark
            </Button>
            {user?._id === post.author._id && (
              <Button variant="ghost" className="w-fit text-[#ED4956] font-bold" onClick={deletePostHandler}>
                Delete
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </div>
      <img src={post.image} alt="post" />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 my-2">
          {liked ? (
            <FaHeart className="size-[32px] text-red-600"  onClick={likeAndDislikeHandler} />
          ) : (
            <CiHeart className="cursor-pointer size-[32px] hover:text-gray-400" onClick={likeAndDislikeHandler} />
          )}
          <MessageCircle onClick={() => setOpen(true)} className="cursor-pointer hover:text-gray-400" />
          <Send className="cursor-pointer hover:text-gray-400" />
        </div>
        <Bookmark
          onClick={bookmarkHandler}
          className={`cursor-pointer hover:text-gray-400 ${isBookmarked ? "bg-black text-white" : ""}`}
        />
      </div>
      <span className="font-medium block mb-2">{countLike} Likes</span>
      <p>
        <span className="font-medium mr-2">{post.author.username}</span>
        {post.caption}
      </p>
      <span onClick={() => setOpen(true)}>view {comment.length} comments</span>
      <Comment open={open} setOpen={setOpen} postIMage={post.image} post={post} />
      <div className="flex items-center justify-between">
        <input
          type="text"
          value={text}
          className="outline-none text-sm w-full"
          placeholder="Add a comment..."
          onChange={changeEventHandler}
        />
        {text && <span onClick={commentHandler} className="text-[#0d9eff] cursor-pointer">Post</span>}
      </div>
    </div>
  );
}

export default Post;
