import authMiddleware from "../middleware/auth.middleware.js";
import express from "express";
import {
  likePost,
  dislikePost,
} from "../controllers/likeDislike.controller.js";

const likeDislikeRouter = express.Router();

// Define the route for liking a post
likeDislikeRouter.post("/like/:postId", authMiddleware, likePost);

// Define the route for disliking a post
likeDislikeRouter.post("/dislike/:postId", authMiddleware, dislikePost);

export default likeDislikeRouter;
