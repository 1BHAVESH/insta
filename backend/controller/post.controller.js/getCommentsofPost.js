import { Comment } from "../../modals/comment.modal.js";
import { Post } from "../../modals/post.modal.js";
import { User } from "../../modals/user.modal.js";

// export const getCommentsOfPost = async(req, res) => {

//     try {
//         const postId = req.params.id;

//         const post = await Post.findById(postId);

//         console.log(post)

//         if(!post){
//             return res.status(404).json({ message: "Post not found", success: false });
//         }

//         const getComments = await post.populate({path:"comments", select:"text"})

//         return res.status(200).json({
//             mesaage:"comments posts",
//             getComments,
//             success:true
//         })
//     } catch (error) {
//         console.log(error)
//     }
// }

export const getCommentsOfPost = async(req, res) => {

    try {
        const postId = req.params.id;

        const comments = await Comment.find({post: postId}).populate("author", "username profilePicture")

        console.log(comments)

        if(!comments){
            return res.status(404).json({ message: "Post not found", success: false });
        }

       
        
        return res.status(200).json({
            mesaage:"comments posts",
            comments,
            success:true
        })
    } catch (error) {
        console.log(error)
    }
}