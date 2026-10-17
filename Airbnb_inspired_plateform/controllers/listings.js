const Listing = require("../models/listing.js");
const mongoose = require("mongoose");
const {isLoggedIn,isOwner} = require("../middleware.js");

// GEOCODING
async function getCoordinates(location, country) {
    try {
        if (!location || !country) {
            return null;
        }

        const query = `${location}, ${country}`;
        const url =
            `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`;

        const response = await fetch(url, {
            headers: {
                "User-Agent": "WanderLust-Dev-App/1.0"
            }
        });

        if (!response.ok) {
            console.log(
                "Geocoding failed:",
                response.status
            );
            return null;
        }

        const data = await response.json();
        if (!data || data.length === 0) {

            console.log("Location not found:",query);
            return null;
        }

        return {
            latitude: Number(data[0].lat),
            longitude: Number(data[0].lon)
        };

    } catch (error) {
        console.log(
            "Geocoding error:",
            error.message
        );
        return null;
    }
}

// INDEX
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});

    res.render("listings/index", {
        allListings
    });
};

// NEW LISTING FORM
module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};


// SHOW LISTING
module.exports.showListings = async (req, res) => {
    const { id } = req.params;
    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        req.flash(
            "error",
            "Invalid listing ID!"
        );
        return res.redirect("/listings");
    }

    // Find listing
    const listing = await Listing
        .findById(id)
        .populate({
            path:"reviews",
            populate:{
                path:"owner",
            },
        })
        .populate("owner");

    // Listing not found

    if (!listing) {
        req.flash(
            "error",
            "Listing does not exist!"
        );
        return res.redirect("/listings");
    }

    // Show page
    res.render(
        "listings/show.ejs",
        {
            listing,
            currentUser: req.user
        }
    );
};


// CREATE LISTING
module.exports.createListing = async (req, res) => {
    const listingData = req.body.listing;

    // Create listing
    const newListing = new Listing(listingData);

    // Owner
    newListing.owner = req.user._id;

    // Cloudinary image
    if (req.file) {

        newListing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }

    // Geocoding
    const coordinates = await getCoordinates(
        listingData.location,
        listingData.country
    );

    // Save geometry
    if (coordinates) {
        newListing.geometry = {
            type: "Point",

            // GeoJSON format:
            // [longitude, latitude]
            coordinates: [
                coordinates.longitude,
                coordinates.latitude
            ]
        };
    }

    // Save listing
    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
};

// EDIT LISTING
module.exports.editListings = async (req, res) => { 
    const { id } = req.params; 

    // Validate ID 
    if (!mongoose.Types.ObjectId.isValid(id)) { 
        req.flash(  "error",  "Invalid listing ID!"); 
        return res.redirect("/listings"); 
    } 
 
    // Find listing 
    const listing = await Listing.findById(id); 

    if (!listing) { 
        req.flash( 
            "error", 
            "Listing does not exist!" 
        ); 
        return res.redirect("/listings"); 
    } 
 
    // Render edit page 
    res.render( 
        "listings/edit.ejs", 
        { 
            listing 
        } 
    ); 
};


// UPDATE LISTING
module.exports.updateListing = async (req, res) => { 
    const { id } = req.params; 
    // Validate ID 
    if (!mongoose.Types.ObjectId.isValid(id)) { 
        req.flash( 
            "error", 
            "Invalid listing ID!" 
        ); 
        return res.redirect("/listings"); 
    } 
 
    const listingData = req.body.listing; 

    // Security 

    delete listingData.owner; 
 
    // Update data 

    const updateData = {...listingData }; 

    // New Cloudinary image 
    if (req.file) { 
        updateData.image = { 
            url: req.file.path, 
            filename: req.file.filename 
        }; 
    } 
 
    // Geocoding 
 
    const coordinates = await getCoordinates( listingData.location, listingData.country); 
    // Update geometry 
    if (coordinates) { 
        updateData.geometry = { 
            type: "Point", 
     coordinates: [coordinates.longitude,coordinates.latitude] 
        }; 
    } 
 
    // Update database 
    await Listing.findByIdAndUpdate(id, 
        {$set: updateData},{new: true,runValidators: true} 
    ); 
 
    req.flash( "success","Listing Updated Successfully!"); 
    res.redirect(`/listings/${id}`); 
};

// DELETE LISTING
module.exports.deleteListings = async (req, res) => { 
    const { id } = req.params; 

    //Validate ID 
    if (!mongoose.Types.ObjectId.isValid(id)) { 
        req.flash("error","Invalid listing ID!" 
        ); 
        return res.redirect("/listings"); 
    } 
 
    // Delete listing 
    await Listing.findByIdAndDelete(id); 
    req.flash("success","Listing Deleted!"); 
    res.redirect("/listings"); 
};