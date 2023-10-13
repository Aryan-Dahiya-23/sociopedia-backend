import express from "express";
import dotenv from 'dotenv';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import cookieParser from "cookie-parser";
const app = express();
app.use(cookieParser());

dotenv.config();

const secret = process.env.secret;

// Registring in
export const register = async (req, res) => {
    try {
        const { fName, lName, email, profileImageUrl, username, password } = req.body;

        const existingEmail = await User.findOne({ email });
        const existingUsername = await User.findOne({ username });

        if (existingEmail) return res.status(409).json({ error: "Email already exists" });
        if (existingUsername) return res.status(409).json({ error: "Username already exists" });

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({ fName, lName, email, username, password: passwordHash, profileImageUrl });
        const savedUser = await newUser.save();

        console.log(savedUser);
        res.status(201).json({ savedUser });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
};

// Logging in 
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email: email });
        if (!user) return res.status(404).json({ msg: "User does not exist. " });

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            jwt.sign({ email, id: user._id }, secret, {}, (err, token) => {
                if (err) throw err;
                // res.cookie("token", token).json(user);
                // user.notifications.reverse();
                res.status(200).json({ user, token });
            });
        } else {
            return res.status(401).json({ msg: "Invalid credentials. " });
        }

    } catch (err) {
        res.status(500).json({ msg: "An error occurred during Sign In, Please Try Again!" });
    }
};

// Verifying
export const verify = async (req, res) => {
    try {

        const token = req.header('Authorization')?.split(' ')[1];

        console.log("token: " + token);
        const decodedToken = jwt.verify(token, secret);

        const { email } = decodedToken;
        const user = await User.findOne({ email });
        // user.notifications.reverse();
        res.json(user);
    } catch (err) {
        res.status(401).json({ message: 'Authentication failed' });
    }
};

// Logging Out
export const logout = (req, res) => {
    res.cookie("token", "").json("Ok");
};
