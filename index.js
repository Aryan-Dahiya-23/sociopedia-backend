import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import multer from "multer";
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

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = multer({ storage });

dotenv.config();
const app = express();

// Apply middleware
app.use("/uploads", express.static("uploads"));
app.use(express.json());
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
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
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB:", err);
    });


async function clearCollections() {
    try {
        // Clear the User collection
        await User.deleteMany({});
        console.log('User collection cleared.');

        // Clear the Post collection
        await Post.deleteMany({});
        console.log('Post collection cleared.');

        // Close the database connection
        mongoose.connection.close();
    } catch (error) {
        console.error('Error clearing collections:', error);
    }
}

// Call the function to clear the collections
// clearCollections();

// Auth Routes
// app.post("/register", upload.single("profileImage"), register);
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
// app.post("/createpost", upload.single("file"), createPost);
app.post("/createpost", createPost);
app.get("/fetchposts", fetchPosts);
app.post("/updatepost", updatePost);
app.get("/fetchmyposts", fetchMyPosts);
app.get("/fetchlikedposts", fetchLikedPosts);
app.get("/fetchsavedposts", fetchSavedPosts);

app.get("/", (req, res) => {
    res.send("Hello World");
});

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
