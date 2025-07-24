import express from "express";
import postsRouter from "./routes/posts.route.js";
import userRouter from "./routes/user.route.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

// initialize express app
const app = express();

// Middleware to parse JSON, URL-encoded data and enable CORS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// default home route to test the server
app.get("/", (req, res) => {
  res.send("Hello, for my first Blog Api");
});

// use the router middleware for handling routes
app.use("/api", postsRouter);
app.use("/api/user", userRouter);

export default app;
