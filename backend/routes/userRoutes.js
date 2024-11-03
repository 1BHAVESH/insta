import express from "express"
import { login, Logout, regisetr } from "../controller/user.controller.js";
import { isAuthnticated } from "../middleweres/isAuthticated.js";
import { getProfile } from "../controller/profile/getProfile.controller.js";
import upload from "../middleweres/multer.js";
import { editProfile } from "../controller/profile/editProfile.js";
import { getSuggestedUser } from "../controller/getSuggestedUsers.js";
import { followOrUnfollow } from "../controller/followOrUnfollow.controller.js";

const router = express.Router();

router.route("/register").post(regisetr)
router.route("/login").post(login)
router.route("/logout").get(Logout)
router.route("/:id/profile").get(isAuthnticated, getProfile)
router.route("/profile/edit").post(isAuthnticated, upload.single("profilePicture"), editProfile)
router.route("/suggested").get(isAuthnticated, getSuggestedUser)
router.route("/followOrUnfollow/:id").get(isAuthnticated, followOrUnfollow)

export default router;
