import express from "express";
import postsRouter from "./routes/posts.route.js";

// initialize express app
const app = express();

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// default home route to test the server
app.get("/", (req, res) => {
  res.send("Hello, for my first Blog Api");
});

// use the router middleware for handling routes
app.use("/api", postsRouter);

export default app;