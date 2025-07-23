import Post from "../../models/posts.models.js";

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
      return res.status(404).json({ message: "No posts found with the cirteria" });
    }

    res.status(200).json(posts);
  } catch (error) {
    // If an error occurs, it sends a 500 status code with an error message
    res.status(500).json({ message: "Error fetching posts", error });
  }
};

export default getAllPosts;
