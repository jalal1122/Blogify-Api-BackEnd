import Post from "../models/posts.models.js";

// Create a new post
// This function creates a new post with the provided data and saves it to the database.
const createPost = async (req, res) => {
  const { title, content, author, category, tags } = req.body;
  try {
    const newPost = await Post.create({
      title,
      content,
      author,
      category,
      tags,
    });
    // If the post is created successfully, it sends the new post data with a 201 status code
    res.status(201).json(newPost);
  } catch (error) {
    // If an error occurs, it sends a 500 status code with an error message
    res
      .status(500)
      .json({ message: "Error creating post", error: error.message });
  }
};

// Delete All Posts
const deleteAllPosts = async (req, res) => {
  try {
    // Delete all posts from the database
    await Post.deleteMany({});

    // Send a success response
    res.status(200).json({
      message: "All posts deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting all posts",
      error: error.message,
    });
  }
};

// Delete a post by ID
const deletePostById = async (req, res) => {
  const { id } = req.params;
  try {
    // Find the post by ID and delete it
    const deletedPost = await Post.findByIdAndDelete(id);
    // If the post is not found, it sends a 404 status code with a message
    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    // If the post is deleted successfully, it sends a success message with a 200 status code
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    // If an error occurs, it sends a 500 status code with an error message
    res.status(500).json({ message: "Error deleting post", error });
  }
};

// Get All Posts
// This function retrieves all posts from the database and sends them as a JSON response.
const getAllPosts = async (req, res) => {
  const { search, category, author, page, limit, tag, sort } = req.query;

  // Calculate pagination
  const pageNum = page ? Math.max(1, parseInt(page)) : 1; // Ensure page is at least 1
  const limitNum = limit ? Math.max(1, parseInt(limit)) : 10; // Default limit to 10
  const skip = (pageNum - 1) * limitNum; // Calculate the number of posts to skip

  // Determine sort order
  const sortOrder = sort === "asc" ? 1 : -1; // Default to descending (-1)

  try {
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
      filters.push({ author: { $regex: author, $options: "i" } });
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
      return res
        .status(404)
        .json({ message: "No posts found with the cirteria" });
    }

    res.status(200).json(posts);
  } catch (error) {
    // If an error occurs, it sends a 500 status code with an error message
    res.status(500).json({ message: "Error fetching posts", error });
  }
};

// Get Post by ID
// This function retrieves a single post by its ID from the database and sends it as a JSON
const getPostById = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id);
    // If the post is not found, it sends a 404 status code with a message
    // If the post is found, it sends the post data with a 200 status code
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    // If an error occurs, it sends a 500 status code with an error message
    res.status(500).json({ message: "Error fetching post", error });
  }
};

// Get Post Statistics
const getPostStats = async (req, res) => {
  try {
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

    res.status(200).json({
      totalPosts,
      postsByCategory,
      postsByAuthor,
    });
  } catch (error) {
    // If an error occurs, it sends a 500 status code with an error message
    res.status(500).json({ message: "Error fetching post statistics", error });
  }
};

// Update a post by ID
const updatePostbyId = async (req, res) => {
  try {
    // Extract the post ID from the request parameters and the updated data from the request body
    const { id } = req.params;
    const { title, content, author, category, tags } = req.body;

    // Find the post by ID and update it with the new data
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { title, content, author, category, tags },
      { new: true } // This option returns the updated document
    );
    // If the post is not found, it sends a 404 status code with a message
    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    // If the post is updated successfully, it sends the updated post data with a 200 status code
    res.status(200).json({ updatedPost, message: "Post updated successfully" });
  } catch (error) {
    // If an error occurs, it sends a 500 status code with an error message
    res.status(500).json({ message: "Error updating post", error });
  }
};

export {
  createPost,
  deleteAllPosts,
  deletePostById,
  getAllPosts,
  getPostById,
  getPostStats,
  updatePostbyId,
};
