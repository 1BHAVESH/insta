import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

const ShowComment = ({comment}) => {

    // console.log(comment)


  return (
    <div className="my-2">
        <div className="flex items-center gap-3">
            <Avatar className="w-5 h-5 ">
                <AvatarImage className="object-cover" src={comment?.author?.profilePicture} />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <h1 className="font-bold text-sm">{comment?.author?.username} <span className="font-normal pl-3">{comment?.text}</span></h1>
        </div>
    </div>
  )
}

export default ShowComment