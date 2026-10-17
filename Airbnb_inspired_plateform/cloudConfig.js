const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// CLOUDINARY CONFIGURATION
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,

    // Give Cloudinary more time for uploads
    timeout: 60000
});

// MULTER CLOUDINARY STORAGE
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "WanderLust_DEV",
        allowed_formats: [
            "png",
            "jpg",
            "jpeg",
            "webp"
        ]
    }

});

module.exports = {
    cloudinary,
    storage
};