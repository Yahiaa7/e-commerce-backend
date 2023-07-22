const { User } = require('../models');
const { singleUpload, multer } = require('../config/multer.config');

exports.checkDuplicateUser = async (req, res, next) => {
    try {
        let { username } = req.body;
        if (!username) return res.status(400).json({ message: 'Bad Request, insufficient params >_<' });
        let user = await User.findOne({ where: { username } });
        if (user) return res.status(409).json({ message: 'Conflict, a user with the same username already exists :(' });
        return next();
    } catch (err) {
        return res.status(500).json({ message: `Internal Error, Please try again later! ${err}` });
    }
};

exports.imageUploadUser = async (req, res, next) => {
    const uploadPP = singleUpload.single('image');

    uploadPP(req, res, err => {
        if (err instanceof multer.MulterError) return res.status(400).json({
            message: 'Bad Request, file upload error. >_<',
            error: err.message
        });
        else if (err) return res.status(500).json({ message: `${err.message}` });

        return next();
    });
};