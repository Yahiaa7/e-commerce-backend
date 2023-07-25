const { User } = require('../models');
const { singleUpload, multer } = require('../config/multer.config');
const { redisClient } = require('../utils/redis');
const { verify, JsonWebTokenError } = require('jsonwebtoken');

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

exports.authenticateJWT = async (req, res, next) => {
    try {
        let { authorization } = req.headers;
        if (!authorization) return res.status(401).json({ message: 'Unauthorized, not enough params! >_<' });
        const token = authorization.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'Unauthorized, not enough params! >_<' });
        const { id, exp } = verify(token, process.env.PDK);
        const isBlackListed = await redisClient.exists(token);
        if (isBlackListed) return res.status(401).json({
            message: 'Unauthorized, you have logged out please reauthenticate! >_<'
        });
        if (!id) return res.status(400).json({ message: 'Bad Request, insufficient params >_<' });
        req.tokenInfo = { token, id, exp };
        return next();
    } catch (err) {
        if (err instanceof JsonWebTokenError) return res.status(400).json({ message: 'Bad Token >_<' });
        if (err instanceof TokenExpiredError) return res.status(401).json({
            message: 'Unauthorized, token expired, please reauthenticate! >_<'
        });
        else return res.status(500).json({ message: 'Internal Error, Please try again later!', err });
    }
};

exports.isAdmin = async (req, res, next) => {
    let { id } = req.tokenInfo;
    let user = await User.findByPk(id);
    if (user.role == 'Admin') return next();
    else return res.status(403).send('forbidden >_<');
};

exports.isStoreAdmin = async (req, res, next) => {
    let { id } = req.tokenInfo;
    let user = await User.findByPk(id);
    if (user.role == 'Store Manager') return next();
    else return res.status(403).send('forbidden >_<');
};

exports.isAdvertisingManager = async (req, res, next) => {
    let { id } = req.tokenInfo;
    let user = await User.findByPk(id);
    if (user.role == 'Advertising Manager') return next();
    else return res.status(403).send('forbidden >_<');
};

exports.isUser = async (req, res, next) => {
    let { id } = req.tokenInfo;
    let user = await User.findByPk(id);
    if (user.role == 'User') return next();
    else return res.status(403).send('forbidden >_<');
};