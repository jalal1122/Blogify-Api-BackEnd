import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import User from "../models/user.models.js";
import ApiResponse from "../utils/ApiResponse.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// cookie options
const cookieOptions = {
  httpOnly: true,
  secure: false,
};

// Register a new user
const registerUser = asyncHandler(async (req, res) => {
  // get the user data from the request body
  const { username, email, password } = req.body;

  //   Validate user data
  if (!username || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  // Check if user already exists
  const existingUser = await User.find({ email });
  if (existingUser.length > 0) {
    throw new ApiError(400, "User already exists with this email");
  }

  // Create a new user
  const user = new User({
    username,
    email,
    password,
  });

  // Save the user to the database
  await user.save();

  // Send response
  res.status(201).json(
    new ApiResponse(201, "User registered successfully", {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    })
  );
});

// Login a user
const loginUser = asyncHandler(async (req, res) => {
  // get the user data from the request body
  const { email, password } = req.body;

  // validate the user data
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  // Find the user by email
  const user = await User.findOne({ email }).select("+password +refreshToken");
  if (!user) {
    throw new ApiError(404, "User not found or invalid email");
  }

  // check for the password match
  const isPasswordValid = await bcrypt.compare(password, user.password);

  // If password is not valid, throw an error
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid password");
  }

  // Generate access and refresh tokens
  const accessToken = await user.generateAccessToken();
  const refreshToken = await user.generateRefreshToken();

  // Save the refresh token in the user document
  user.refreshToken = refreshToken;
  await user.save();

  // Send response with tokens
  res
    .status(200)
    .cookie("loggedUser", user._id, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .cookie("accessToken", accessToken, cookieOptions)
    .json(
      new ApiResponse(200, "User logged in successfully", {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
        tokens: {
          accessToken,
          refreshToken,
        },
      })
    );
});

// Logout a user
const logoutUser = asyncHandler(async (req, res) => {
  const { id } = req.user;

  // Find the user by ID
  const user = await User.findById(id).select("-password");

  // If user not found, throw an error
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Clear the refresh token from the user document
  user.refreshToken = null;
  await user.save();

  // clear the refresh token and access token from the cookies and
  res
    .status(200)
    .clearCookie("refreshToken", cookieOptions)
    .clearCookie("accessToken", cookieOptions)
    .json(new ApiResponse(200, "User logged out successfully"));
});

export { registerUser, loginUser, logoutUser };
