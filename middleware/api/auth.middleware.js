const { verify, JsonWebTokenError, TokenExpiredError } = require('jsonwebtoken');
const { redisClient } = require('../../utils/redis');
const { responseFailed } = require('../../utils/responseReturn');

exports.authenticateJWT = async (req, res, next) => {
    try {
        let { authorization } = req.headers;
        if (!authorization) return responseFailed(res, 401, { error_message: 'Unauthorized, not enough params! >_<' });
        const token = authorization.split(' ')[1];
        if (!token) return responseFailed(res, 401, { error_message: 'Unauthorized, not enough params! >_<' });
        const isBlackListed = await redisClient.exists(token);
        if (isBlackListed) return responseFailed(res, 401, {
            error_message: 'Unauthorized, you have logged out please reauthenticate! >_<'
        });
        const { id, exp, role } = verify(token, process.env.PDK);
        if (!id || !role) return responseFailed(res, 400, { error_message: 'Bad Request, insufficient params >_<' });
        req.tokenInfo = { token, id, role, exp };
        return next();
    } catch (err) {
        if (err instanceof TokenExpiredError) return responseFailed(res, 401, {
            error_message: 'Unauthorized, token expired, please reauthenticate! >_<',
            error: err.message
        });
        if (err instanceof JsonWebTokenError) return responseFailed(res, 401, {
            error_message: 'Unauthorized, Bad Token >_<', error: err.message
        });
        else return responseFailed(res, 500, {
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
        if (!refreshToken) return responseFailed(res, 401, {
            error_message: 'Unauthorized, not enough params! >_<',
        });
        let isBlackListed = await redisClient.exists(refreshToken);
        if (isBlackListed) return responseFailed(res, 401, {
            error_message: 'Unauthorized, your refresh token is invalid, please reauthenticate! >_<',
        });
        const { id, exp } = verify(refreshToken, process.env.REFRESH_PDK);
        if (!id) return responseFailed(res, 400, { error_message: 'Bad Request, insufficient params >_<' });
        // checking the state of the current authToken
        let { authorization } = req.headers;
        if (!authorization) return responseFailed(res, 401, { error_message: 'Unauthorized, not enough params! >_<' });
        const token = authorization.split(' ')[1];
        if (!token) return responseFailed(res, 401, { error_message: 'Unauthorized, not enough params! >_<' });
        // if the user logs out he can't use the refreshToken, right?
        // but is there a case where the refresh token is blacklisted and the authToken is not ?
        // in the logout i guess
        isBlackListed = await redisClient.exists(token);
        if (isBlackListed) return responseFailed(res, 401, {
            error_message: 'Unauthorized, you have logged out please reauthenticate! >_<'
        });
        // check if the token is valid or not, blacklist it if it is, that simple  
        verify(token, process.env.PDK, async (err, payload) => {
            if (err instanceof TokenExpiredError)
                console.log('Token Expired! >_<');
            else if (err instanceof JsonWebTokenError) return responseFailed(res, 401, { error_message: 'Unauthorized, not enough params! >_<' });
            !err ?? await redisClient.set(token, "blacklisted", 'EX', parseInt((payload.exp * 1000 - Date.now()) / 1000, 10));
        });
        // sending refresh token data to the controller
        req.tokenInfo = { refreshToken, id, exp };
        return next();
    } catch (err) {
        if (err instanceof TokenExpiredError) return responseFailed(res, 401, {
            error_message: 'Unauthorized, refresh token expired, please reauthenticate! >_<',
            error: err.message
        });
        if (err instanceof JsonWebTokenError) return responseFailed(res, 401, {
            error_message: 'Unauthorized, Bad Refresh Token >_<',
            error: err.message
        });
        else return responseFailed(res, 500, {
            error_message: 'Internal Error, Please try again later!',
            error: err.message
        });
    }
};


exports.isAdmin = async (req, res, next) => {
    if (req.tokenInfo.role == 'Admin') return next();
    else return responseFailed(res, 403, { error_message: 'Forbidden >_<' });
};

exports.isStoreManager = async (req, res, next) => {
    if (req.tokenInfo.role == 'Store Manager') return next();
    else return responseFailed(res, 403, { error_message: 'Forbidden >_<' });
};

exports.isAdvertisingManager = async (req, res, next) => {
    if (req.tokenInfo.role == 'Advertising Manager') return next();
    else return responseFailed(res, 403, { error_message: 'Forbidden >_<' });
};

exports.isUser = async (req, res, next) => {
    if (req.tokenInfo.role == 'User') return next();
    else return responseFailed(res, 403, { error_message: 'Forbidden >_<' });
};