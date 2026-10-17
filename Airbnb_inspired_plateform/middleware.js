const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");

// Login check

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash(
      "error",
      "You must be logged in to continue!"
    );
    return res.redirect("/login");
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash(
        "error",
        "Listing does not exist!"
      );
      return res.redirect("/listings");
    }

    if (
      !listing.owner ||
      !listing.owner.equals(req.user._id)
    ) {
      req.flash(
        "error",
        "You don't have permission to edit or delete this listing! Because You are not Owner of this property Listing"
      );
      return res.redirect(`/listings/${id}`);
    }
    next();

  } catch (err) {
    next(err);

  }

};

module.exports.redirectSave = (req, res, next) => {
  if (req.session.redirectUrl) {
      res.locals.redirectUrl =
      req.session.redirectUrl;
  }

  next();
};

// Validation

module.exports.validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const errMsg = error.details
      .map((el) => el.message)
      .join(",");
    throw new ExpressError(
      400,
      errMsg
    );
  }

  next();
};

// Review validation
module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const errMsg = error.details
      .map((el) => el.message)
      .join(",");
    return next(
      new ExpressError(
        400,
        errMsg
      )
    );
  }

  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  try {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review) {
      req.flash("error","Review does not exist!");
      return res.redirect(`/listings/${id}`);
    }

    console.log("Review owner:", review.owner);
    console.log("Logged in user:", req.user._id);
    if (!review.owner) {
      req.flash("error","Review owner is missing!");
      return res.redirect(`/listings/${id}`);
    }

    if (review.owner.toString() !== req.user._id.toString()) {
      req.flash("error","You don't have permission to delete this review!" );
      return res.redirect(`/listings/${id}`);
    }

    next();
  } catch (err) {
    next(err);
  }
};