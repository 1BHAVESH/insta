import { Post } from "../../modals/post.modal.js";

export const getUserAccountPost = async (req, res) => {
  try {
    const authorId = req.id;

    const post = await Post.find({ author: req.id })
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username profilePicture" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: {
          path: "author",
          select: "username profilePicture",
        },
      });

      return res.status(200).json({
        mesaage:"feed posts",
        post,
        success:true
       
    })
  } catch (error) {}
};
