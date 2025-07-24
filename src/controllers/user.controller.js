import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import User from "../models/user.models.js";
import ApiResponse from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }
});
