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

export function login(req, res) {

    const user = new User({
        email: req.body.email,
        password: req.body.password
    });

    req.login(user, function (err) {
        if (err) {
            res.status(500).json({ error: "Invalid Credentials" });
        } else {
            passport.authenticate("local")(req, res, function () {
                console.log("Login user: ", user);
                res.status(201).json({ message: "Login successful", user: user });
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