import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    fName: {
        type: String,
        required: true
    },
    lName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profileImageUrl: {
        type: String
    },
    coverImageUrl: {
        type: String
    },
    friends: {
        type: []
    },
    posts: {
        type: []
    },
    likedPosts: {
        type: [],
    },
    savedPosts: {
        type: [],
    },
    comments: {
        type: [{
            postId: String,
            commentText: String
        }]
    },
    notifications: {
        type: []
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const User = mongoose.model('User', userSchema);
export default User;