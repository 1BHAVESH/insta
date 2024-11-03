import React from 'react'
import Post from './Post.jsx'
import { useSelector } from 'react-redux'

function Posts() {

  const {posts} = useSelector(store => store.posts)

  // console.log(post)
  return (
    <div>
        {
            posts.map((pos) => <Post key={pos._id} post={pos}/>)
        }
    </div>
  )
}

export default Posts