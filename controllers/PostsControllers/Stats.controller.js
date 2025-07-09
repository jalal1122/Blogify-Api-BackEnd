import Post from "../../models/posts.models.js";

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

// Export the getPostStats function to be used in routes
export default getPostStats;
