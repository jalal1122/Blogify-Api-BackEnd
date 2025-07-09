import Post from "../../models/posts.models.js";

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

export default deleteAllPosts;
