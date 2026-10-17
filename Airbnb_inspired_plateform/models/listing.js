const mongoose = require("mongoose");

const Review = require("./review.js");

const listingSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        required: true
    },

    image: {
        url:String,
        filename:String,
    },

    price: {
        type: Number,
        required: true,
        min: 0
    },

    location: {
        type: String,
        required: true,
        trim: true
    },

    country: {
        type: String,
        required: true,
        trim: true
    },

    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    geometry: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point"
        },

        coordinates: {
            type: [Number],
            default: [0, 0]
        }

    },

    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]

});


// DELETE REVIEWS WHEN LISTING IS DELETED
listingSchema.post(
    "findOneAndDelete",
    async (listing) => {
        if (listing) {
            await Review.deleteMany({
                _id: {
                    $in: listing.reviews
                }
            });

        }

    }
);

// MODEL
const Listing = mongoose.model(
    "Listing",
    listingSchema
);

module.exports = Listing;