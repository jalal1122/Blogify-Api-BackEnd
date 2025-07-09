import Post from "../../models/posts.models";

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

export default updatePostbyId;
