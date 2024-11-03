import express from "express"
import { isAuthnticated } from "../middleweres/isAuthticated.js";
import { sendMessage } from "../controller/conversation.controller.js/sendMessage.js";
import { getMessage } from "../controller/conversation.controller.js/getMesaage.js";

const router = express.Router();

router.route("/send/:id").post(isAuthnticated, sendMessage); 
router.route("/recive/:id").get(isAuthnticated, getMessage);

export default router;