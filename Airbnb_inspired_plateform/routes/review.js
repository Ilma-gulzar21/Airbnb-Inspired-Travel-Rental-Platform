const express = require("express");
const router = express.Router({
    mergeParams: true
});

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {validateReview, isLoggedIn,isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

// CREATE REVIEW
router.post(
    "/",
    isLoggedIn,
    validateReview,
    wrapAsync(reviewController.postReview)
);

// DELETE REVIEW
router.delete(
    "/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.deleteReview)
);

module.exports = router;