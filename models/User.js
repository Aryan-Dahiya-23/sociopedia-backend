import mongoose from 'mongoose';
import passport from "passport";
import passportLocalMongoose from 'passport-local-mongoose';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// userSchema.plugin(passportLocalMongoose);

userSchema.plugin(passportLocalMongoose, { usernameField : 'email' });


const User = mongoose.model('User', userSchema);

export default User;