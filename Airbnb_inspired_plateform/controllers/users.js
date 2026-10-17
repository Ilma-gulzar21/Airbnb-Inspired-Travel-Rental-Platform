const User = require("../models/user.js");

//LOGIN PAGE 
module.exports.login = (req, res) => {
    res.render("users/login.ejs");
};

//SIGNUP PAGE
module.exports.signup = (req, res) => {
    res.render("users/signup.ejs");
};


// SIGNUP
module.exports.Postsignup = async (req, res) => {
    try {
        const {
            username,
            email,
            password
        } = req.body;

        const newUser = new User({
            email,
            username
        });

        const registeredUser =
            await User.register(
                newUser,
                password
            );

        console.log(registeredUser);
        
  req.login(registeredUser,(err)=>{
        if (err) {
            return next(err);
        }
         req.flash(
            "success",
            "Welcome to Wanderlust!"
        );
        res.redirect("/listings");
  })

    } catch (e) {
        console.log("Signup Error:", e.message);
        req.flash("error",e.message);
        res.redirect("/signup");
    }
};


//LOGIN
module.exports.postLogin = async (req, res) => {
    req.flash(
        "success",
        "Welcome back to Wanderlust"
    );
    const redirectUrl =
        res.locals.redirectUrl || "/listings";

    // Clear old redirect
    delete req.session.redirectUrl;
    res.redirect(redirectUrl);
};

module.exports.logoutUser = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }

        req.flash("success", "You have been logged out!");
        res.redirect("/listings");
    });
};
