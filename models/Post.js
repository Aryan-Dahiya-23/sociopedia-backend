import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    caption: {
        type: String
    },
    imageUrl: {
        type: String
    },
    likesCount: {
        type: Number,
        default: 0
    },
    likedByUserIds: {
        type: []
    },
    commentsCount: {
        type: Number,
        default: 0
    },
    comments: {
        type: [{
            id: String,
            name: String,
            profileImageUrl: String,
            comment: String
        }]
    },
    createdBy: {
        type: {
            id: String,
            name: String,
            profileImageUrl: String
        }
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Post = mongoose.model('Post', postSchema);
export default Post;