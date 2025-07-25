import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { makeComment, getComments } from "../controllers/comment.controller.js";

// Create a new router for comments
const commentRouter = express.Router();

// Define routes for comments
// @POST /comments/:postId - Create a new comment for a post
// @GET /comments/:postId - Get all comments for a post
commentRouter
  .route("/:postId")
  .post(authMiddleware, makeComment)
  .get(authMiddleware, getComments);

export default commentRouter;
