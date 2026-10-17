require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

// ================= ROUTES =================
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// ================= SESSION =================
const session = require("express-session");

// IMPORTANT:
// connect-mongo ke current CommonJS syntax me
// MongoStore ko destructure karke import karna hai.
const { MongoStore } = require("connect-mongo");

const flash = require("connect-flash");

// ================= PASSPORT =================
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

// ================= ERROR =================
const ExpressError = require("./utils/ExpressError.js");

// ======================================================
// DATABASE
// ======================================================

const dbUrl = process.env.ATLASDB_URL;

if (!dbUrl) {
  console.error("❌ ATLASDB_URL is missing in .env file");
  process.exit(1);
}

// ================= MONGODB CONNECTION =================

async function main() {
  await mongoose.connect(dbUrl);
}

main()
  .then(() => {
    console.log("✅ Connected to MongoDB Atlas");
  })
  .catch((err) => {
    console.log("❌ MongoDB Connection Error:");
    console.log(err);
  });

// ======================================================
// EJS
// ======================================================

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

// ======================================================
// MIDDLEWARE
// ======================================================

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(methodOverride("_method"));

app.use(express.static(path.join(__dirname, "public")));

// ======================================================
// MONGODB SESSION STORE
// ======================================================

const store = MongoStore.create({
  mongoUrl: dbUrl,
   crypto:{
    secret: process.env.SECRET,
   },
  touchAfter: 24 * 60 * 60,
});

store.on("error", (err) => {
  console.log("❌ Error in MongoDB Session Store:");
  console.log(err);
});

// ======================================================
// SESSION
// ======================================================

const sessionOption = {
  store: store,

  secret: process.env.SESSION_SECRET || process.env.SECRET,

  resave: false,

  saveUninitialized: true,

  cookie: {
    expires: new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    ),

    maxAge: 7 * 24 * 60 * 60 * 1000,

    httpOnly: true,
  },
};

app.use(session(sessionOption));

// ======================================================
// FLASH
// ======================================================

app.use(flash());

// ======================================================
// PASSPORT
// ======================================================

app.use(passport.initialize());

app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());

passport.deserializeUser(User.deserializeUser());

// ======================================================
// GLOBAL VARIABLES
// ======================================================

app.use((req, res, next) => {
  res.locals.success = req.flash("success");

  res.locals.error = req.flash("error");

  res.locals.currUser = req.user;

  next();
});

// ======================================================
// HOME
// ======================================================

app.get("/", (req, res) => {
  res.redirect("/listings");
});

// ======================================================
// ROUTES
// ======================================================

app.use("/listings", listingRouter);

app.use("/listings/:id/reviews", reviewRouter);

app.use("/", userRouter);

// ======================================================
// 404 ERROR
// ======================================================

app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

// ======================================================
// ERROR HANDLER
// ======================================================

app.use((err, req, res, next) => {
  console.log("ERROR:", err);

  let {
    statusCode = 500,
    message = "Something went wrong!",
  } = err;

  res.status(statusCode).render("error.ejs", {
    message,
  });
});

// ======================================================
// SERVER
// ======================================================

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});