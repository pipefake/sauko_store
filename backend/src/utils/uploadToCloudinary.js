const cloudinary = require('../utils/cloudinary');

const uploadToCloudinary = async (fileBuffer) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
        }).end(fileBuffer);
    });
};

module.exports = {
    uploadToCloudinary
};
