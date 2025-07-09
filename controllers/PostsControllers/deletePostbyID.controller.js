import Post from "../../models/posts.models";

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

export default deletePostById;
