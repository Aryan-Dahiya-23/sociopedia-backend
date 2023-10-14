import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import User from "./models/User.js";
import Post from "./models/Post.js";
import {
  register,
  login,
  verify,
  logout,
} from "./contollers/authController.js";
import {
  user,
  updateUser,
  updateFriend,
  fetchFriends,
  fetchAccounts,
  addNotification,
} from "./contollers/userController.js";
import {
  createPost,
  fetchPosts,
  updatePost,
  fetchMyPosts,
  fetchLikedPosts,
  fetchSavedPosts,
} from "./contollers/postController.js";

dotenv.config();
const app = express();

// Apply middleware
app.use("/uploads", express.static("uploads"));
app.use(express.json());
// app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(cors({ credentials: true, origin: "https://sociopedia-aryan.vercel.app" }));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    const port = process.env.PORT;
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });


// Auth Routes
app.post("/register", register);
app.post("/login", login);
app.post("/logout", logout);
app.get("/profile", verify);

// User Routes
app.get("/user", user);
app.post("/updateuser", updateUser);
app.post("/updatefriend/:friendId", updateFriend);
app.get("/fetchfriends", fetchFriends);
app.get("/accounts", fetchAccounts);
app.post("/addnotification/:id", addNotification);

// Post Routes
app.post("/createpost", createPost);
app.get("/fetchposts", fetchPosts);
app.post("/updatepost", updatePost);
app.get("/fetchmyposts", fetchMyPosts);
app.get("/fetchlikedposts", fetchLikedPosts);
app.get("/fetchsavedposts", fetchSavedPosts);

app.get("/", (req, res) => {
  res.send("Hello World");
});