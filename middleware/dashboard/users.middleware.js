const { validationResult } = require("express-validator");
const { singleUpload, multer } = require("../../config/multer.config");
const { userSchema } = require("../../utils/schemas");
const fs = require('fs/promises');

exports.imageUploadUser = async (req, res, next) => {
    const uploadPP = singleUpload.single('image');

    uploadPP(req, res, err => {
        // fix the return thing
        if (err instanceof multer.MulterError) return next(new multer.MulterError('Error uploading image!'));
        else if (err) return next(new Error('Error processing your request!'));
        return next();
    });
};