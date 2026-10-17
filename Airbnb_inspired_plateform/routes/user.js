const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");

const userController = require("../controllers/users.js");
const { redirectSave, } = require("../middleware.js");

// SIGNUP 

router.route("/signup")
    // Signup page
    .get(userController.signup)

    // Signup
    .post(
        wrapAsync(userController.Postsignup)
    );

// LOGIN

router.route("/login")

    // Login page
    .get(userController.login)

    // Login
    .post(
        redirectSave,
        passport.authenticate(
            "local",
            {
                failureRedirect: "/login",
                failureFlash: true
            }
        ),
        userController.postLogin
    );

router.get("/logout", userController.logoutUser);
module.exports = router;