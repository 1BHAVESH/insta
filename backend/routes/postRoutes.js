import express from "express"
import { isAuthnticated } from "../middleweres/isAuthticated.js";
import { createPost } from "../controller/post.controller.js/createPost.js";
import upload from "../middleweres/multer.js";
import { getFeedPost } from "../controller/post.controller.js/getFeedPost.js";
import { createComment } from "../controller/post.controller.js/createComment.js";
import { postLikeAndDislike } from "../controller/post.controller.js/postLike.js";
import { getCommentsOfPost } from "../controller/post.controller.js/getCommentsofPost.js";
import { deletePost } from "../controller/post.controller.js/deletePost.js";
import { bookmark } from "../controller/post.controller.js/bookmark.js";
import { getUserAccountPost } from "../controller/post.controller.js/getUsersAccountPost.js";
const router = express.Router();

router.route("/create_post").post(isAuthnticated,  upload.single("image"), createPost);
router.route("/feed_post").get(isAuthnticated, getFeedPost)
router.route("/user_posts").get(isAuthnticated, getUserAccountPost)
router.route("/:id/create_comment").post(isAuthnticated, createComment)
router.route("/:id/like_or_dislike").get(isAuthnticated, postLikeAndDislike)
router.route("/:id/comment_post").get(isAuthnticated, getCommentsOfPost)
router.route("/:id/delete_post").delete(isAuthnticated, deletePost)
router.route("/:id/bookmark").get(isAuthnticated, bookmark);
export default router;
