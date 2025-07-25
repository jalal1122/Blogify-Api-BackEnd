import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Post from "../models/posts.models.js";

// Like a Post
const likePost = asyncHandler(async (req, res) => {
  // get the userId from the req
  const userId = req.user._id;

  // if the userId is not present, return an error
  if (!userId) {
    throw new ApiError(400, "User is not logged in");
  }

  // get the postId from params
  const postId = req.params.postId;

  // if the postId is not present, return an error
  if (!postId) {
    throw new ApiError(400, "Post ID is required");
  }

  // find the post by postId
  const post = await Post.findById(postId);

  // if the post is not found, return an error
  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  if (!post.likes.includes(userId) && post.dislikes.includes(userId)) {
    // if the user has already liked the post, remove the like
    post.likes.push(userId);

    post.dislikes = post.dislikes.filter(
      (dislike) => dislike.toString() !== userId.toString()
    );
  } else if (post.likes.includes(userId) && !post.dislikes.includes(userId)) {
    post.likes = post.likes.filter(
      (like) => like.toString() !== userId.toString()
    );
  } else if (!post.likes.includes(userId) && !post.dislikes.includes(userId)) {
    // if the user has not liked or disliked the post, add the like
    post.likes.push(userId);
  }

  // save the post
  await post.save();

  // populate the post with author, comments, likes, and dislikes
  await post.populate("author", "username email");
  await post.populate("comments", "author text");
  await post.populate("likes", "username email");
  await post.populate("dislikes", "username email");

  // respond with the updated post
  res
    .status(200)
    .json(new ApiResponse(200, "Post like status updated successfully", post));
});

// Dislike a Post
const dislikePost = asyncHandler(async (req, res) => {
  // get the userId from the req
  const userId = req.user._id;

  // if the userId is not present, return an error
  if (!userId) {
    throw new ApiError(400, "User is not logged in");
  }

  // get the postId from params
  const postId = req.params.postId;

  // if the postId is not present, return an error
  if (!postId) {
    throw new ApiError(400, "Post ID is required");
  }

  // find the post by postId
  const post = await Post.findById(postId);

  // if the post is not found, return an error
  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  if (!post.dislikes.includes(userId) && post.likes.includes(userId)) {
    post.dislikes.push(userId);

    post.likes = post.likes.filter(
      (like) => like.toString() !== userId.toString()
    );
  } else if (post.dislikes.includes(userId) && !post.likes.includes(userId)) {
    post.dislikes = post.dislikes.filter(
      (dislike) => dislike.toString() !== userId.toString()
    );
  } else if (!post.dislikes.includes(userId) && !post.likes.includes(userId)) {
    // if the user has not liked or disliked the post, add the dislike
    post.dislikes.push(userId);
  }

  // save the post
  await post.save();

  // populate the post with author, comments, likes, and dislikes
  await post.populate("author", "username email");
  await post.populate("comments", "author text");
  await post.populate("likes", "username email");
  await post.populate("dislikes", "username email");

  // respond with the updated post
  res
    .status(200)
    .json(
      new ApiResponse(200, "Post dislike status updated successfully", post)
    );
});

export { likePost, dislikePost };
