import Post from "../../models/posts.models";

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

export default getPostById;
