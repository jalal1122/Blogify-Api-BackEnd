import Post from "../../models/posts.models";

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

export default createPost;