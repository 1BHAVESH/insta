import React, { useDebugValue, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { converIntoDataUrl } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "./../../redux/postSlice.js";

function CreatePost({ open, setOpen }) {

  const dispatch = useDispatch()

  const {posts} = useSelector(store => store.posts)

  // console.log(posts)

  const {user} = useSelector(store => store.auth)
  const imageRef = useRef();

  const [file, setFile] = useState("");
  const [caption, setCaption] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(false);

  const fileChangeHandler = async (e) => {
    console.log(e.target.files);

    const file = e.target.files?.[0];
    if (file) {
      setFile(file);

      console.log(file);

      const dataUrl = await converIntoDataUrl(file);

      // console.log(dataUrl)

      setSelectedImage(dataUrl);
    }
  };

  const createPostHandler = async (e) => {
    e.preventDefault();
    try {

        setLoading(true)
        const formData = new FormData();

        formData.append("caption", caption);

        if(selectedImage) formData.append("image", file)

        const res = await axios.post("http://localhost:8080/api/v1/post/create_post", formData, {
            headers: {
                 'Content-Type': 'multipart/form-data'
            },
            withCredentials: true
        })

        console.log(res)

        if(res.data.success){

           dispatch(setPost([res.data.posts, ...posts]))

            toast.success(res.data.mesaage)
        }

    } catch (error) {
      console.log(error);
      toast.error(error.response.data.mesaage);
    } finally{
        setLoading(false)
    }
  };
  return (
    <Dialog open={open}>
      <DialogContent onInteractOutside={() => setOpen(false)}>
        <DialogHeader className="text-center font-semibold">
          Create Post
        </DialogHeader>
        <div className="flex gap-3 items-center">
          <Avatar>
            <AvatarImage src={user?.profilePicture} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-semibold text-xs">{user?.username}</h1>
            <span className="text-gray-600 text-xs">Bio here...</span>
          </div>
        </div>
        <Textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="focus-visible:ring-transparent border-none"
          placeholder="write a caption...."
        />
        {selectedImage && (
          <div className="w-full h-64 flex items-center justify-center mb-4">
            <img src={selectedImage} className="object-cover h-full w-full rounded-md" />
          </div>
        )}
        <input
          ref={imageRef}
          type="file"
          className="hidden"
          onChange={fileChangeHandler}
        />
        {selectedImage ? (
          ""
        ) : (
          <Button
            onClick={() => imageRef.current.click()}
            className="w-fit mx-auto bg-gray-700"
          >
            Select Image
          </Button>
        )}
        {selectedImage &&
          (loading ? (
            <Button>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button
              type="submit"
              onClick={createPostHandler}
              className="w-full mt-2"
            >
              Post
            </Button>
          ))}
      </DialogContent>
    </Dialog>
  );
}

export default CreatePost;
