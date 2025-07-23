import express from "express";
import postsRouter from "./routes/posts.route.js";
import mongoose from "mongoose";
import { errorHandler } from "./middleware/error.middleware.js";

// initialize express app
const app = express();

// connect to MongoDB using mongoose
const MONGO_URI = process.env.CONNECTION_STRING;
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
    // listen on the specified port
    // and log a message to the console
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error("MongoDB connection error:", err));

// get the port from environment variables or default to 3000
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware for error handling
app.use(errorHandler);

// default home route to test the server
app.get("/", (req, res) => {
  res.send("Hello, for my first Blog Api");
});

// use the router middleware for handling routes
app.use("/api", postsRouter);
