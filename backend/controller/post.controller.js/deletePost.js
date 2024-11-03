import { Comment } from "../../modals/comment.modal.js";
import { Post } from "../../modals/post.modal.js";
import { User } from "../../modals/user.modal.js";

export const deletePost = async(req, res) => {
    try {
        const userId = req.id;
    const postId = req.params.id;

    const post  = await Post.findById(postId);

    if(!post) return res.status(403).json({message:'post not found'});

    if(post.author.toString() !== userId) return res.status(403).json({message:'Unauthorized'});

    await Post.findByIdAndDelete(postId);

    const user = await User.findById(userId);

    user.posts = user.posts.filter(id => id.toString() !== postId);

    await user.save();

    await Comment.deleteMany({post: postId});

    return res.status(200).json({
        success:true,
        message:'Post deleted'
    })
    
    } catch (error) {
        console.log(error)
    }
}