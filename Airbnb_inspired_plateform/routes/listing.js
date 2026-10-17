const express = require("express");
const router = express.Router();
const multer = require("multer");
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const listingController = require("../controllers/listings.js");
const {validateListing} = require("../middleware.js");

//CLOUDINARY
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

//MIDDLEWARE
const {
    isLoggedIn,
    isOwner
} = require("../middleware.js");

// INDEX + CREATE
router.route("/")

    // INDEX
    .get(wrapAsync(listingController.index))

    // CREATE
    .post(
        isLoggedIn,
        validateListing,
        upload.single("listing[image]"),
        wrapAsync(listingController.createListing)
    );

// NEW LISTING FORM
router.get(
    "/new",
    isLoggedIn,
    listingController.renderNewForm
);

// SEARCH
// IMPORTANT: /search should come before /:id
router.get(
    "/search",
    wrapAsync(async (req, res) => {
        const { place } = req.query;
        if (!place) {
            req.flash("error","Please enter a location");
            return res.redirect("/listings");
        }
        const listings = await Listing.find({
            $or:[{ location: {
                        $regex: place,
                        $options: "i"
                    }
                },

                {
                    title: {
                        $regex: place,
                        $options: "i"
                    }
                },

                {
                    country: {
                        $regex: place,
                        $options: "i"
                    }
                }
            ]
        });

        res.render("listings/search.ejs",{listings,place}
        );

    })
);

// EDIT LISTING PAGE
router.get(
    "/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.editListings)
);

// SHOW + UPDATE
router.route("/:id")
    // SHOW
    .get(wrapAsync(listingController.showListings))

    // UPDATE
    .put(
        isLoggedIn,
        isOwner,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listingController.updateListing)
    )

    // DELETE
    .delete(
        isLoggedIn,
        isOwner,
        wrapAsync(listingController.deleteListings)
    );

module.exports = router;