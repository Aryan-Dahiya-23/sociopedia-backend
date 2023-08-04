// import express from "express";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import User from "../models/User.js";
// import cookieParser from "cookie-parser";
// const app = express();
// app.use(cookieParser());

// const secret = "veryDifficultToGuess";

// // Registring in
// export const register = async (req, res) => {
//     try {
//         const {email, password } = req.body;

//         const salt = await bcrypt.genSalt();
//         const passwordHash = await bcrypt.hash(password, salt);

//         const newUser = new User({email, password: passwordHash });
//         const savedUser = await newUser.save();
//         res.status(201).json(savedUser);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };

// // Logging in 
// export const login = async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         const user = await User.findOne({ email: email });
//         if (!user) return res.status(400).json({ msg: "User does not exist. " });

//         const isMatch = await bcrypt.compare(password, user.password);

//         if (isMatch) {
//             jwt.sign({ email, id: user._id }, secret, {}, (err, token) => {
//                 if (err) throw err;
//                 res.cookie("token", token).json("ok");
//             });
//         } else {
//             return res.status(400).json({ msg: "Invalid credentials. " });
//         }

//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };

// // Verifying
// export const verify = (req, res) => {
//     try {
//         const { token } = req.cookies;
//         const decodedToken = jwt.verify(token, secret);
//         res.json(decodedToken);
//     } catch (err) {
//         res.status(401).json({ message: 'Authentication failed' });
//     }
// };

// // Logging Out
// export const logout = (req, res) => {
//     res.cookie("token", "").json("Ok");
// };







import passport from "passport";
import passportLocalMongoose from 'passport-local-mongoose';
import User from "../models/User.js";
import cookieParser from "cookie-parser";
import express from 'express';
const app = express();
app.use(cookieParser());

export function register(req, res) {

    const { email, password } = req.body;

    User.register({ email }, password, function (err, user) {

        if (err) {
            console.log(err);
            res.status(500).json({ error: err });
        } else {
            passport.authenticate("local")(req, res, function () {
                console.log("User registered: ", user);
                res.status(201).json({ message: "Registration successful", user: user });
            });
        }
    });

};

// export function login(req, res) {

//     const user = new User({
//         email: req.body.email,
//         password: req.body.password
//     });

//     req.login(user, function (err) {
//         if (err) {
//             res.status(401).json({ error: "Invalid Credentials" });
//         } else {
//             passport.authenticate("local")(req, res, function () {
//                 console.log("Login user: ", user);
//                 res.status(200).json("ok");
//             });
//         }
//     });

// }


export function login(req, res) {
    const user = new User({
        email: req.body.email,
        password: req.body.password
    });

    req.login(user, function (err) {
        if (err) {
            console.error("Error during login:", err);
            res.status(401).json({ error: "Invalid Credentials" });
        } else {
            console.log("User successfully logged in:", user.email);
            passport.authenticate("local")(req, res, function () {
                console.log("Passport authentication successful:", user.email);
                res.status(200).json("ok");
            });
        }
    });
}


export function verify(req, res) {
    if (req.isAuthenticated()) {
        res.status(200).json({ authenticated: true });
    } else {
        res.status(401).json({ authenticated: false });
    }
};