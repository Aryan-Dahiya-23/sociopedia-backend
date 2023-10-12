import User from "../models/User.js";
import Post from "../models/Post.js";

export const createPost = async (req, res) => {
  try {
    const { userId, caption, picturePath } = req.body;

    const user = await User.findById(userId);

    const createdBy = {
      id: user._id,
      name: user.fName + " " + user.lName,
      profileImageUrl: user.profileImageUrl,
    };

    const newPost = new Post({
      caption,
      imageUrl: picturePath,
      createdBy: createdBy,
    });
    const savedPost = await newPost.save();
    const postId = savedPost._id;

    await User.updateOne({ _id: userId }, { $push: { posts: postId } });

    res.status(200).json({ message: "Post created successfully" });
  } catch (error) {
    res.status(400).json({ message: "An error Occured, please try again!" });
  }
};

export const fetchPosts = async (req, res) => {
  const { id } = req.query;
  try {
    // const posts = await Post.find({ "createdBy.id": { $ne: id } });
    const posts = await Post.find();
    posts.sort(() => Math.random() - 0.5);
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts" });
  }
};

// For Fetching Non Liked Posts Only
// export const fetchPosts = async (req, res) => {
//     const { id } = req.query;
//     console.log("Fetching All Posts");

//     try {
//         const posts = await Post.find({
//             'createdBy.id': { $ne: id },
//             'likedByUserIds': { $nin: [id] }
//         });
//         res.status(200).json(posts);
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching posts' });
//     }
// };

export const updatePost = async (req, res) => {
  try {
    const { post } = req.body;

    const updatedPost = await Post.findOneAndUpdate({ _id: post._id }, post, {
      new: true,
    });

    if (updatedPost) {
      return res.status(200).json(updatedPost);
    } else {
      return res.status(404).json({ message: "Post not found or not updated" });
    }
  } catch (error) {
    console.error("Error updating post:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const fetchMyPosts = async (req, res) => {
  const { id } = req.query;
  try {
    const posts = await Post.find({ "createdBy.id": id });
    posts.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts" });
  }
};

export const fetchLikedPosts = async (req, res) => {
  const { id } = req.query;
  try {
    const posts = await Post.find({ likedByUserIds: id });
    console.log(posts);
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts" });
  }
};

export const fetchSavedPosts = async (req, res) => {
  const { id } = req.query;

  const user = await User.findById(id);
  const savedPostsArray = user.savedPosts;

  try {
    const posts = await Post.find({ _id: { $in: savedPostsArray } });
    console.log(posts);
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts" });
  }
};
