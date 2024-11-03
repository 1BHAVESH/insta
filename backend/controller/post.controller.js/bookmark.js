import { Post } from "../../modals/post.modal.js";
import { User } from "../../modals/user.modal.js";

export const bookmark = async(req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.id;

        const post = await Post.findById(postId);
        const user = await User.findById(userId);

        if(user.bookmarks.includes(post._id)){

            //already bookmarked

            await user.updateOne({$pull: {bookmarks: post._id}})

            await user.save();

            return res.status(200).json({type:'unsaved', message:'Post removed from bookmark', success:true, user});

        }else{

            await user.updateOne({$addToSet:{bookmarks:post._id}});

             await user.save();

            console.log(user)

            return res.status(200).json({type:'saved', message:'Post bookmarked', success:true, user});
        }

    } catch (error) {
        console.log(error)
    }
}