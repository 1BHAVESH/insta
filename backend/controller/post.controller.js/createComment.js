import { Comment } from "../../modals/comment.modal.js";
import { Post } from "../../modals/post.modal.js";

export const createComment = async (req, res) => {
  try {
    console.log("post id", req.params.id);
    const postId = req.params.id;
    const userId = req.id;

    console.log(userId);
    console.log("11111111", req.body);

    const { text } = req.body;

    // Check if text is provided
    if (!text) {
      return res.status(400).json({ message: "Text is required", success: false });
    }

    // Create comment
    const comment = await Comment.create({
      text,
      author: userId,
      post: postId,
    });

    // Populate comment author
    const populatedComment = await Comment.findById(comment._id).populate({
      path: "author",
      select: "username profilePicture",
    });

    // Find the post and check if it exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found", success: false });
    }

    // Add comment to the post's comment array
    post.comments.push(comment._id);
    await post.save();

    return res.status(201).json({
      message: "New comment created",
      comment: populatedComment,
      success: true,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error", success: false });
  }
};
