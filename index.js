import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import multer from 'multer';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import session from 'express-session';
import passport from 'passport';
import passportLocalMongoose from 'passport-local-mongoose';
// import { register, login, verify } from './contollers/authController.js';
// import User from './models/User.js';

dotenv.config();

const app = express();

// Apply middleware
app.use(express.json());
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(helmet());
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
    secret: 'your-secret',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });

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

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

const User = mongoose.model('User', userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.post("/register", (req, res) => {

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

});


app.post("/login", (req, res) => {
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
});

app.get("/check-auth", (req, res) => {
    if (req.isAuthenticated()) {
        res.status(200).json({ authenticated: true });
    } else {
        res.status(401).json({ authenticated: false });
    }
});

app.get('/', (req, res) => {
    res.send("Hello World");
});

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
