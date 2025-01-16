const { verify, JsonWebTokenError, TokenExpiredError } = require('jsonwebtoken');
const { redisClient } = require('../../config/redis.conf');
const { responseFailed } = require('../../utils/responseReturn'); // Import utility for standardized error responses

// Middleware to authenticate JWT for protected routes
exports.authenticateJWT = async (req, res, next) => {
    try {
        let { authorization } = req.headers; // Get authorization header
        if (!authorization) return responseFailed(res, 401, { error_message: 'Unauthorized, not enough params! >_<' }); // No token in header
        const token = authorization.split(' ')[1]; // Extract token from header (Bearer <token>)
        if (!token) return responseFailed(res, 401, { error_message: 'Unauthorized, not enough params! >_<' }); // No token provided

        // Check if token is blacklisted (i.e., the user has logged out)
        if (await isBlackListed(token)) return responseFailed(res, 401, { error_message: 'Unauthorized, you have logged out please reauthenticate! >_<' });

        // Verify the token
        const { id, exp, role } = verify(token, process.env.PDK);
        if (!id || !role) return responseFailed(res, 400, { error_message: 'Bad Request, insufficient params >_<' }); // Missing essential token data

        // Attach token information to request for use in further middleware
        req.tokenInfo = { token, id, role, exp };
        return next();
    } catch (err) {
        if (err instanceof TokenExpiredError) return responseFailed(res, 401, {
            error_message: 'Unauthorized, token expired, please reauthenticate! >_<',
            error: err.message
        });
        if (err instanceof JsonWebTokenError) return responseFailed(res, 401, {
            error_message: 'Unauthorized, Bad Token >_<',
            error: err.message
        });
        return responseFailed(res, 500, {
            error_message: 'Internal Error, Please try again later!',
            error: err.message
        });
    }
};

// Middleware to authenticate refresh tokens
exports.authenticateRefreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body; // Extract refresh token from request body
        if (!refreshToken) return responseFailed(res, 401, { error_message: 'Unauthorized, not enough params! >_<', }); // No refresh token provided

        // Check if the refresh token is blacklisted (i.e., invalidated)
        if (await isBlackListed(refreshToken)) return responseFailed(res, 401, { error_message: 'Unauthorized, your refresh token is invalid, please reauthenticate! >_<', });

        // Verify the refresh token
        const { id, exp } = verify(refreshToken, process.env.REFRESH_PDK);
        if (!id) return responseFailed(res, 400, { error_message: 'Bad Request, insufficient params >_<' }); // Missing user ID in refresh token

        // Verify the main JWT token in the authorization header
        let { authorization } = req.headers;
        if (!authorization) return responseFailed(res, 401, { error_message: 'Unauthorized, not enough params! >_<' });
        const token = authorization.split(' ')[1]; // Extract token
        if (!token) return responseFailed(res, 401, { error_message: 'Unauthorized, not enough params! >_<' }); // No token provided

        // Check if the main token is blacklisted
        if (await isBlackListed(token)) return responseFailed(res, 401, { error_message: 'Unauthorized, you have logged out please reauthenticate! >_<' });
   
        // Verify and blacklist the token if necessary
        verify(token, process.env.PDK, async (err, payload) => {
            if (err instanceof TokenExpiredError) console.log('Token Expired! >_<');
            else if (err instanceof JsonWebTokenError) return responseFailed(res, 401, { error_message: 'Unauthorized, not enough params! >_<' });

            // Blacklist the token if valid
            !err ?? await redisClient.set(`JWT_${token}`, "blacklisted", 'EX', parseInt((payload.exp * 1000 - Date.now()) / 1000, 10));
        });

        // Attach refresh token data to the request
        req.tokenInfo = { refreshToken, id, exp };
        return next(); // Proceed to next middleware
    } catch (err) {
        if (err instanceof TokenExpiredError) return responseFailed(res, 401, {
            error_message: 'Unauthorized, refresh token expired, please reauthenticate! >_<',
            error: err.message
        });
        if (err instanceof JsonWebTokenError) return responseFailed(res, 401, {
            error_message: 'Unauthorized, Bad Refresh Token >_<',
            error: err.message
        });
        return responseFailed(res, 500, {
            error_message: 'Internal Error, Please try again later!',
            error: err.message
        });
    }
};

// helper function isBlackListed
const isBlackListed = async (token) => await redisClient.exists(`JWT_${token}`);


// Role-specific functions to check if the provided role matches the expected role
exports.isAdmin = (role) => role === 'Admin';
exports.isStoreManager = (role) => role === 'Store Manager';
exports.isAdvertisingManager = (role) => role === 'Advertising Manager';
exports.isUser = (role) => role === 'User';

// Middleware to check if the user's role matches any of the allowed roles
// Arguments: Multiple role-checking functions (e.g., isAdmin, isUser)
// Checks the role in req.tokenInfo and allows or denies access accordingly
exports.hasAccess = (...allowedRoles) => (req, res, next) =>
    allowedRoles.some(roleF => roleF(req.tokenInfo.role))
        ? next() // If the user's role matches any allowed role, proceed to the next middleware
        : responseFailed(res, 403, { error_message: 'Forbidden >_<' }); // Otherwise, send a 403 Forbidden response
