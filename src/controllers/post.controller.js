import Post from "../models/posts.models.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

// Create a new post
// This function creates a new post with the provided data and saves it to the database.
const createPost = asyncHandler(async (req, res) => {
  const author = req.cookies?.loggedUser; // Assuming the author's ID is stored in cookies

  if (!author) {
    throw new ApiError(400, "User is not logged in");
  }

  const { title, content, category, tags } = req.body;

  // Validate required fields
  if (!title || !content || !category) {
    // If any required field is missing, it throws an ApiError with a 400 status code
    throw new ApiError(400, "Title, content, and category are required");
  }

  const newPost = await Post.create({
    title,
    content,
    author, // Assuming req.user is populated with the authenticated user's data
    category,
    tags: tags || [], // Tags are optional, default to an empty array
  });

  if (!newPost) {
    // If the post creation fails, it throws an ApiError with a 500 status code
    throw new ApiError(500, "Failed to create post");
  }

  // If the post is created successfully, it sends the new post data with a 201 status code
  res
    .status(201)
    .json(new ApiResponse(201, "Post created successfully", newPost));
});

// Delete All Posts (Dangerous operation, use with caution)
const deleteAllPosts = asyncHandler(async (req, res) => {
  // Delete all posts from the database
  const result = await Post.deleteMany({});

  if (result.deletedCount === 0) {
    // If no posts were deleted, it throws an ApiError with a 404 status code
    throw new ApiError(404, "No posts found to delete");
  }

  res.status(200).json(
    new ApiResponse(200, "All posts deleted successfully", {
      deletedCount: result.deletedCount,
    })
  );
});

// Delete a post by ID
const deletePostById = asyncHandler(async (req, res) => {
  // get the logged user ID from cookies
  const userId = req.cookies?.loggedUser;

  if (!userId) {
    throw new ApiError(400, "User is not logged in");
  }

  // Extract the post ID from the request parameters
  const { id } = req.params;

  // Find the post by ID and delete it
  const deletedPost = await Post.findById(id);

  // If the post is not found, it sends a 404 status code with a message
  if (!deletedPost) {
    throw new ApiError(404, "Post not found");
  }

  // Check if the user is the author of the post
  if (deletedPost.author.toString() !== userId) {
    throw new ApiError(403, "You are not authorized to delete this post");
  }

  // Delete the post
  await Post.findByIdAndDelete(id);

  // If the post is deleted successfully, it sends a success message with a 200 status code
  res
    .status(200)
    .json(new ApiResponse(200, "Post deleted successfully", deletedPost));
});

// Get All Posts
// This function retrieves all posts from the database and sends them as a JSON response.
const getAllPosts = asyncHandler(async (req, res) => {
  const author = req.cookies?.loggedUser; // Assuming the author's ID is stored in cookies

  // Check if the user is logged in
  if (!author) {
    throw new ApiError(400, "User is not logged in");
  }

  // get the query parameters
  const { search, category, page, limit, tag, sort } = req.query;

  // Calculate pagination
  const pageNum = page ? Math.max(1, parseInt(page)) : 1; // Ensure page is at least 1
  const limitNum = limit ? Math.max(1, parseInt(limit)) : 10; // Default limit to 10
  const skip = (pageNum - 1) * limitNum; // Calculate the number of posts to skip

  // Determine sort order
  const sortOrder = sort === "asc" ? 1 : -1; // Default to descending (-1)
  // Build query filters
  const filters = [];

  // Add search filter if provided
  if (search) {
    filters.push({
      $or: [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ],
    });
  }

  // Add category filter if provided
  if (category) {
    filters.push({ category: { $regex: category, $options: "i" } });
  }

  // Add author filter if provided
  if (author) {
    filters.push({ author: author });
  }

  // Add tag filter if provided
  if (tag) {
    filters.push({ tags: { $in: [tag] } });
  }

  // Combine all filters with $and operator, or use empty object if no filters
  const query = filters.length > 0 ? { $and: filters } : {};

  // Execute query with pagination and sorting
  const posts = await Post.find(query)
    .skip(skip)
    .limit(limitNum)
    .sort({ createdAt: sortOrder });

  if (posts.length === 0) {
    throw new ApiError(404, "No posts found matching the criteria");
  }

  res
    .status(200)
    .json(new ApiResponse(200, "Posts retrieved successfully", posts));
});

// Get Post by ID
// This function retrieves a single post by its ID from the database and sends it as a JSON
const getPostById = asyncHandler(async (req, res) => {
  // get the logged user ID from cookies
  const userId = req.cookies?.loggedUser;

  // Check if the user is logged in
  if (!userId) {
    throw new ApiError(400, "User is not logged in");
  }

  // Extract the post ID from the request parameters
  const { id } = req.params;

  // find the post by ID
  const post = await Post.findById(id);

  // check if the post exists
  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  // Check if the user is the author of the post

  // if author is loggedin or authenticated
  if (post.author.toString() !== userId) {
    throw new ApiError(403, "You are not authorized to view this post");
  }

  // Increment the views count for the post
  post.views += 1;
  await post.save();

  res
    .status(200)
    .json(new ApiResponse(200, "Post retrieved successfully", post));
});

// Get Post Statistics (for admin or analytics)
const getPostStats = asyncHandler(async (req, res) => {
  // Count total number of posts
  const totalPosts = await Post.countDocuments();

  // Count posts by category
  const postsByCategory = await Post.aggregate([
    { $group: { _id: "$category", count: { $sum: 1 } } },
    { $project: { category: "$_id", count: 1, _id: 0 } },
  ]);

  // Count posts by author
  const postsByAuthor = await Post.aggregate([
    { $group: { _id: "$author", count: { $sum: 1 } } },
    { $project: { author: "$_id", count: 1, _id: 0 } },
  ]);

  res.status(200).json(
    new ApiResponse(200, "Post statistics retrieved successfully", {
      totalPosts,
      postsByCategory,
      postsByAuthor,
    })
  );
});

// Update a post by ID
const updatePostbyId = asyncHandler(async (req, res) => {
  // get the logged user ID from cookies
  const userId = req.cookies?.loggedUser;

  // Check if the user is logged in
  if (!userId) {
    throw new ApiError(400, "User is not logged in");
  }

  // get the post id from the request parameters
  const { id } = req.params;

  // find the post by ID
  const post = await Post.findById(id);

  // If the post is not found, it sends a 404 status code with a message
  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  // Check if the user is the author of the post
  if (post.author.toString() !== userId) {
    throw new ApiError(403, "You are not authorized to update this post");
  }

  // get the post data from the request body
  const { title, content, author, category, tags } = req.body;

  // Find the post by ID and update it with the new data
  const updatedPost = await Post.findByIdAndUpdate(
    id,
    { title, content, author, category, tags },
    { new: true } // This option returns the updated document
  );

  // If the post is updated successfully, it sends the updated post data with a 200 status code
  res
    .status(200)
    .json(new ApiResponse(200, "Post updated successfully", updatedPost));
});

export {
  createPost,
  deleteAllPosts,
  deletePostById,
  getAllPosts,
  getPostById,
  getPostStats,
  updatePostbyId,
};
