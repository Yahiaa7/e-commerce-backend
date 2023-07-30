const { User } = require('../models');
const { singleUpload, multer } = require('../config/multer.config');
const { redisClient } = require('../utils/redis');
const { verify, JsonWebTokenError, TokenExpiredError } = require('jsonwebtoken');
const { responseFailed } = require('../utils/responseReturn');


/**
 * responseFailed(res, 400, {
            error_message: 'Bad Params, error validating your information!',
            error: err.message
        });
 */

exports.checkDuplicateUser = async (req, res, next) => {
    try {
        let { username } = req.body;
        if (!username) responseFailed(res, 400, { error_message: 'Bad Request, insufficient params >_<' });
        let user = await User.findOne({ where: { username } });
        if (user) responseFailed(res, 409, { error_message: 'Conflict, a user with the same username already exists :(' });
        return next();
    } catch (err) {
        return responseFailed(res, 500, {
            error_message: 'Internal Error, Please try again later!',
            error: err.message
        });
    }
};

exports.imageUploadUser = async (req, res, next) => {
    const uploadPP = singleUpload.single('image');

    uploadPP(req, res, err => {
        if (err instanceof multer.MulterError) responseFailed(res, 400, {
            error_message: 'Bad Request, file upload error. >_<',
            error: err.message
        });
        else if (err) responseFailed(res, 500, {
            error_message: 'Internal Error, Please try again later!',
            error: err.message
        });
        return next();
    });
};

exports.authenticateJWT = async (req, res, next) => {
    try {
        let { authorization } = req.headers;
        if (!authorization) responseFailed(res, 401, { error_message: 'Unauthorized, not enough params! >_<' });
        const token = authorization.split(' ')[1];
        if (!token) responseFailed(res, 401, { error_message: 'Unauthorized, not enough params! >_<' });
        const isBlackListed = await redisClient.exists(token);
        if (isBlackListed) responseFailed(res, 401, {
            error_message: 'Unauthorized, you have logged out please reauthenticate! >_<'
        });
        const { id, exp, role } = verify(token, process.env.PDK);
        if (!id || !role) responseFailed(res, 400, { error_message: 'Bad Request, insufficient params >_<' });
        req.tokenInfo = { token, id, role, exp };
        return next();
    } catch (err) {
        if (err instanceof TokenExpiredError) responseFailed(res, 401, {
            error_message: 'Unauthorized, token expired, please reauthenticate! >_<',
            error: err.message
        });
        if (err instanceof JsonWebTokenError) responseFailed(res, 401, {
            error_message: 'Unauthorized, Bad Token >_<', error: err.message
        });
        else responseFailed(res, 500, {
            error_message: 'Internal Error, Please try again later!',
            error: err.message
        });
    }
};

exports.authenticateRefreshToken = async (req, res, next) => {
    try {
        // reading the refresh token from the cookies
        // console.log(req.signedCookies.refreshToken);
        const { refreshToken } = req.body;
        if (!refreshToken) responseFailed(res, 401, {
            error_message: 'Unauthorized, not enough params! >_<',
        });
        let isBlackListed = await redisClient.exists(refreshToken);
        if (isBlackListed) responseFailed(res, 401, {
            error_message: 'Unauthorized, your refresh token is invalid, please reauthenticate! >_<',
        });
        const { id, exp } = verify(refreshToken, process.env.REFRESH_PDK);
        if (!id) responseFailed(res, 400, { error_message: 'Bad Request, insufficient params >_<' });
        // checking the state of the current authToken
        let { authorization } = req.headers;
        if (!authorization) responseFailed(res, 401, { error_message: 'Unauthorized, not enough params! >_<' });
        const token = authorization.split(' ')[1];
        if (!token) responseFailed(res, 401, { error_message: 'Unauthorized, not enough params! >_<' });
        // if the user logs out he can't use the refreshToken, right?
        // but is there a case where the refresh token is blacklisted and the authToken is not ?
        // in the logout i guess
        isBlackListed = await redisClient.exists(token);
        if (isBlackListed) responseFailed(res, 401, {
            error_message: 'Unauthorized, you have logged out please reauthenticate! >_<'
        });
        // check if the token is valid or not, blacklist it if it is, that simple  
        verify(token, process.env.PDK, async (err, payload) => {
            if (err instanceof TokenExpiredError)
                console.log('Token Expired! >_<');
            else if (err instanceof JsonWebTokenError) responseFailed(res, 401, { error_message: 'Unauthorized, not enough params! >_<' });
            !err ?? await redisClient.set(token, "blacklisted", 'EX', parseInt((payload.exp * 1000 - Date.now()) / 1000, 10));
        });
        // sending refresh token data to the controller
        req.tokenInfo = { refreshToken, id, exp };
        return next();
    } catch (err) {
        if (err instanceof TokenExpiredError) responseFailed(res, 401, {
            error_message: 'Unauthorized, refresh token expired, please reauthenticate! >_<',
            error: err.message
        });
        if (err instanceof JsonWebTokenError) responseFailed(res, 401, {
            error_message: 'Unauthorized, Bad Refresh Token >_<',
            error: err.message
        });
        else responseFailed(res, 500, {
            error_message: 'Internal Error, Please try again later!',
            error: err.message
        });
    }
};

exports.isAdmin = async (req, res, next) => {
    if (req.tokenInfo.role == 'Admin') return next();
    else responseFailed(res, 403, { error_message: 'Forbidden >_<' });
};

exports.isStoreManager = async (req, res, next) => {
    if (req.tokenInfo.role == 'Store Manager') return next();
    else responseFailed(res, 403, { error_message: 'Forbidden >_<' });
};

exports.isAdvertisingManager = async (req, res, next) => {
    if (req.tokenInfo.role == 'Advertising Manager') return next();
    else responseFailed(res, 403, { error_message: 'Forbidden >_<' });
};

exports.isUser = async (req, res, next) => {
    if (req.tokenInfo.role == 'User') return next();
    else responseFailed(res, 403, { error_message: 'Forbidden >_<' });
};