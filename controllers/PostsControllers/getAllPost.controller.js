import Post from "../../models/posts.models.js";

// Get All Posts
// This function retrieves all posts from the database and sends them as a JSON response.
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    // If an error occurs, it sends a 500 status code with an error message
    res.status(500).json({ message: "Error fetching posts", error });
  }
};

export default getAllPosts;
