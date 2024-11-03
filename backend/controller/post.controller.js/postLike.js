import { Post } from "../../modals/post.modal.js";
import { User } from "../../modals/user.modal.js";
import { getReciverSocketId, io } from "../../socket/socket.js";

export const postLikeAndDislike = async (req, res) => {
    try {
        const userId = req.id;
        const postId = req.params.id;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: "Post not found", success: false });
        }

        const isLiked = post.likes.includes(userId);

        const update = isLiked 
            ? { $pull: { likes: userId } } // If already liked, remove like
            : { $addToSet: { likes: userId } }; // If not liked, add like

        // Update the post with like/unlike
        await Post.findByIdAndUpdate(postId, update, { new: true });

        // Use await here
        const user = await User.findById(userId).select("username profilePicture");

        const postOwnerId = post.author.toString();

        if (postOwnerId !== userId) {
            // Emit a notification
            const notification = {
                type: `${isLiked ? "dislike" : "like"}`,
                userId,
                userDetail: user,
                postId,
                message: `${isLiked ? "your msg was disliked" : "your msg was liked"}`
            };

            const postOwnerSocketId = getReciverSocketId(postOwnerId);
            if (postOwnerSocketId) {  // Check if socket ID is valid
                io.to(postOwnerSocketId).emit("notification", notification);
            }
        }

        return res.status(200).json({
            message: isLiked ? "Post unliked successfully" : "Post liked successfully",
            success: true,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error", success: false });
    }
};
