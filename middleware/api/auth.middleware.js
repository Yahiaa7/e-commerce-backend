/**
 * Middleware for handling authentication and authorization processes.
 * Provides JWT and refresh token verification, role-based access control,
 * and integration with Redis for token blacklisting.
 */

const { verify, JsonWebTokenError, TokenExpiredError } = require('jsonwebtoken');
const { redisClient } = require('../../config/redis.conf'); // Redis client instance
const { responseFailed } = require('../../utils/responseReturn'); // Utility for standardized error responses

/**
 * Middleware to authenticate JWT for protected routes.
 * Validates the token, checks its blacklist status, and attaches token info to the request object.
 */
exports.authenticateJWT = async (req, res, next) => {
    try {
        // Extract authorization header
        let { authorization } = req.headers;
        if (!authorization) return responseFailed(res, 401, { error_message: 'Unauthorized, not enough params! >_<' });
        const token = authorization.split(' ')[1]; // Token is expected in "Bearer <token>" format
        if (!token) return responseFailed(res, 401, { error_message: 'Unauthorized, not enough params! >_<' });

        // Check if the token is blacklisted
        if (await isBlackListed(token)) return responseFailed(res, 401, { error_message: 'Unauthorized, you have logged out please reauthenticate! >_<' });

        // Verify the token and extract payload
        const { id, exp, role } = verify(token, process.env.PDK);
        if (!id || !role) return responseFailed(res, 400, { error_message: 'Bad Request, insufficient params >_<' });

        // Attach token info to the request object
        req.tokenInfo = { token, id, role, exp };
        return next(); // Proceed to the next middleware or route handler
    } catch (err) {
        if (err instanceof TokenExpiredError) {
            return responseFailed(res, 401, { error_message: 'Unauthorized, token expired, please reauthenticate! >_<', error: err.message });
        }
        if (err instanceof JsonWebTokenError) {
            return responseFailed(res, 401, { error_message: 'Unauthorized, Bad Token >_<', error: err.message });
        }
        return responseFailed(res, 500, { error_message: 'Internal Error, Please try again later!', error: err.message });
    }
};

/**
 * Middleware to authenticate refresh tokens.
 * Validates the refresh token and ensures the main JWT token is still valid.
 */
exports.authenticateRefreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) return responseFailed(res, 401, { error_message: 'Unauthorized, not enough params! >_<' });

        // Check if the refresh token is blacklisted
        if (await isBlackListed(refreshToken)) return responseFailed(res, 401, { error_message: 'Unauthorized, your refresh token is invalid, please reauthenticate! >_<' });

        // Verify the refresh token
        const { id, exp } = verify(refreshToken, process.env.REFRESH_PDK);
        if (!id) return responseFailed(res, 400, { error_message: 'Bad Request, insufficient params >_<' });

        // Verify and handle the main JWT token
        let { authorization } = req.headers;
        if (!authorization) return responseFailed(res, 401, { error_message: 'Unauthorized, not enough params! >_<' });
        const token = authorization.split(' ')[1];
        if (!token) return responseFailed(res, 401, { error_message: 'Unauthorized, not enough params! >_<' });

        if (await isBlackListed(token)) return responseFailed(res, 401, { error_message: 'Unauthorized, you have logged out please reauthenticate! >_<' });

        verify(token, process.env.PDK, async (err, payload) => {
            if (err instanceof TokenExpiredError) console.log('Token Expired! >_<');
            else if (err instanceof JsonWebTokenError) return responseFailed(res, 401, { error_message: 'Unauthorized, Bad Token >_<' });

            // If the token is valid, blacklist it
            !err && await redisClient.set(`JWT_${token}`, "blacklisted", 'EX', parseInt((payload.exp * 1000 - Date.now()) / 1000, 10));
        });

        req.tokenInfo = { refreshToken, id, exp };
        return next();
    } catch (err) {
        if (err instanceof TokenExpiredError) {
            return responseFailed(res, 401, { error_message: 'Unauthorized, refresh token expired, please reauthenticate! >_<', error: err.message });
        }
        if (err instanceof JsonWebTokenError) {
            return responseFailed(res, 401, { error_message: 'Unauthorized, Bad Refresh Token >_<', error: err.message });
        }
        return responseFailed(res, 500, { error_message: 'Internal Error, Please try again later!', error: err.message });
    }
};

/**
 * Helper function to check if a token is blacklisted in Redis.
 * @param {string} token - The token to check.
 * @returns {boolean} True if blacklisted, false otherwise.
 */
const isBlackListed = async (token) => await redisClient.exists(`JWT_${token}`);

/**
 * Role-specific checkers for user roles.
 */
exports.isAdmin = (role) => role === 'Admin';
exports.isStoreManager = (role) => role === 'Store Manager';
exports.isAdvertisingManager = (role) => role === 'Advertising Manager';
exports.isUser = (role) => role === 'User';

/**
 * Middleware to check if the user's role matches any of the allowed roles.
 * @param {...Function} allowedRoles - Role-checking functions (e.g., isAdmin, isUser).
 * @returns Middleware function.
 */
exports.hasAccess = (...allowedRoles) => (req, res, next) =>
    allowedRoles.some(roleF => roleF(req.tokenInfo.role))
        ? next()
        : responseFailed(res, 403, { error_message: 'Forbidden >_<' });
