const { singleUpload, multer } = require('../../config/multer.config');
const { responseFailed } = require('../../utils/responseReturn');
const { validationResult } = require('express-validator');
const fs = require('fs/promises');
const { userSchema } = require('../../utils/schemas');

exports.imageUploadUser = async (req, res, next) => {
    const uploadPP = singleUpload.single('image');

    uploadPP(req, res, err => {
        if (err instanceof multer.MulterError) return responseFailed(res, 400, {
            error_message: 'Bad Request, file upload error. >_<',
            error: err.message
        });
        else if (err) return responseFailed(res, 500, {
            error_message: 'Internal Error, Please try again later!',
            error: err.message
        });
        return next();
    });
};

exports.validateUser = async (req, res, next) => {
    await userSchema.run(req);
    const validation = validationResult(req);
    if (validation.errors.length) {
        if (req.file) fs.unlink(req.file.path);
        return responseFailed(res, 400, validation.array());
    };
    return next();
};