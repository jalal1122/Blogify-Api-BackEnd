import mongoose from "mongoose";

// Define the schema for a blog post
// This schema includes fields for title, content, author, category, and tags
const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    category: { type: String, required: true },
    tags: [String],
  },
  {
    timestamps: true,
  }
);

// Create the Post model using the defined schema
const Post = mongoose.model("Post", postSchema);

// Export the Post model for use in other parts of the application
export default Post;
