const { User } = require('../models');
const { singleUpload, multer } = require('../config/multer.config');
const { redisClient } = require('../utils/redis');
const { verify, JsonWebTokenError, TokenExpiredError } = require('jsonwebtoken');

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
        const isBlackListed = await redisClient.exists(token);
        if (isBlackListed) return res.status(401).json({
            message: 'Unauthorized, you have logged out please reauthenticate! >_<'
        });
        const { id, exp, role } = verify(token, process.env.PDK);
        if (!id || !role) return res.status(400).json({ message: 'Bad Request, insufficient params >_<' });
        req.tokenInfo = { token, id, role, exp };
        return next();
    } catch (err) {
        if (err instanceof JsonWebTokenError) return res.status(400).json({ message: 'Bad Token >_<' });
        if (err instanceof TokenExpiredError) return res.status(401).json({
            message: 'Unauthorized, token expired, please reauthenticate! >_<'
        });
        else return res.status(500).json({ message: 'Internal Error, Please try again later!', err });
    }
};

exports.authenticateRefreshToken = async (req, res, next) => {
    try {
        // reading the refresh token from the authorization
        // console.log(req.signedCookies.refreshToken);
        const { refreshToken } = req.body;
        if (!refreshToken) return res.status(401).json({ message: 'Unauthorized, not enough params! >_<' });
        let isBlackListed = await redisClient.exists(refreshToken);
        if (isBlackListed) return res.status(401).json({
            message: 'Unauthorized, your refresh token is invalid, please reauthenticate! >_<'
        });
        const { id, exp } = verify(refreshToken, process.env.REFRESH_PDK);
        if (!id) return res.status(400).json({ message: 'Bad Request, insufficient params >_<' });
        // checking the state of the current authToken
        let { authorization } = req.headers;
        if (!authorization) return res.status(401).json({ message: 'Unauthorized, not enough params! >_<' });
        const token = authorization.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'Unauthorized, not enough params! >_<' });
        // if the user logs out he can't use the refreshToken, right?
        // but is there a case where the refresh token is blacklisted and the authToken is not ?
        // in the logout i guess
        isBlackListed = await redisClient.exists(token);
        if (isBlackListed) return res.status(401).json({
            message: 'Unauthorized, you have logged out please reauthenticate! >_<'
        });
        // check if the token is valid or not, blacklist it if it is, that simple  
        verify(token, process.env.PDK, async (err, payload) => {
            if (err instanceof TokenExpiredError)
                console.log('Unauthorized, refresh token expired, please reauthenticate! >_<');
            else if (err instanceof JsonWebTokenError) return res.status(400).json({ message: 'Bad Token >_<' });
            !err ?? await redisClient.set(token, "blacklisted", 'EX', parseInt((payload.exp * 1000 - Date.now()) / 1000, 10));
        });
        // sending refresh token data to the controller
        req.tokenInfo = { refreshToken, id, exp };
        return next();
    } catch (err) {
        if (err instanceof TokenExpiredError) return res.status(401).json({
            message: 'Unauthorized, refresh token expired, please reauthenticate! >_<'
        });
        if (err instanceof JsonWebTokenError) return res.status(400).json({ message: 'Bad Token >_<' });
        else return res.status(500).json({ message: 'Internal Error, Please try again later!', err });
    }
};

exports.isAdmin = async (req, res, next) => {
    if (req.tokenInfo.role == 'Admin') return next();
    else return res.status(403).send('forbidden >_<');
};

exports.isStoreManager = async (req, res, next) => {
    if (req.tokenInfo.role == 'Store Manager') return next();
    else return res.status(403).send('forbidden >_<');
};

exports.isAdvertisingManager = async (req, res, next) => {
    if (req.tokenInfo.role == 'Advertising Manager') return next();
    else return res.status(403).send('forbidden >_<');
};

exports.isUser = async (req, res, next) => {
    if (req.tokenInfo.role == 'User') return next();
    else return res.status(403).send('forbidden >_<');
};