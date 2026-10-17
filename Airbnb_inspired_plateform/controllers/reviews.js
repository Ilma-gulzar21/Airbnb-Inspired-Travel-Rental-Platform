const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

// CREATE REVIEW
module.exports.postReview = async (req, res) => {
    const { id } = req.params;
    
    // Find listing
    const listing = await Listing.findById(id);

    // Listing not found
    if (!listing) {
        req.flash("error","Listing not found!");
        return res.redirect("/listings");
    }

    // Create new review
    const newReview = new Review(req.body.review);

    // Store logged-in user as review owner
    newReview.owner = req.user._id;

    // Add review to listing
    listing.reviews.push(newReview);

    // Save review
    await newReview.save();

    // Save listing
    await listing.save();

    // Success message
    req.flash("success","New Review Created!");
    res.redirect(`/listings/${listing._id}`);
};

// DELETE REVIEW
module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;

    // Remove review from listing
    await Listing.findByIdAndUpdate(id,
        {$pull: {reviews: reviewId}});

    // Delete review document
    await Review.findByIdAndDelete(
        reviewId
    );

    // Success message
    req.flash(
        "success",
        "Review Deleted!"
    );

    // Redirect to listing
    res.redirect(
        `/listings/${id}`
    );
};