const { multiUpload, multer } = require("../../config/multer.config");

exports.imageUploadProduct = async (req, res, next) => {
    const uploadPP = multiUpload.array('images', 5);

    uploadPP(req, res, err => {
        // if (err instanceof multer.MulterError) responseFailed(res, 400, {
        //     error_message: 'Bad Request, file upload error. >_<',
        //     error: err.message
        // });
        // else 
        if (err) return res.redirect('/dashboard/500.ejs');
        return next();
    });
};