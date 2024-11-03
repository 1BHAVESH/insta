import { Post } from "../../modals/post.modal.js"

export const getFeedPost = async (req, res) => {

    try {
        const post = await Post.find()
    .sort({ createdAt: -1 })
    .populate({path: "author", select:"username profilePicture"})
    .populate({
        path: "comments",
        sort: {createdAt: -1},
        populate:{
            path: "author",
            select: "username profilePicture"
        }
    })


        // console.log(post);

        return res.status(200).json({
            mesaage:"feed posts",
            post,
            success:true
           
        })
    } catch (error) {
        console.log(error)
    }
}