/**
 * Utility functions for standardized API responses.
 * Provides methods to send success or failure responses in a consistent JSON structure.
 */

/**
 * Sends a success response.
 * @param {Object} res - The response object provided by Express.
 * @param {number} code - The HTTP status code for the response.
 * @param {Object} payload - The data to be included in the response.
 * @param {string} [message] - Optional message describing the success.
 * @returns {Object} The JSON response object.
 */
module.exports.responseSuccess = (res, code, payload, message) =>
    res.status(code).json({
        status: 'Success', // Indicates the success of the operation
        code,              // HTTP status code
        message: message ?? '', // Optional success message
        payload,           // Data payload for the response
        error: {}          // Empty error object for successful responses
    });

/**
 * Sends a failure response.
 * @param {Object} res - The response object provided by Express.
 * @param {number} code - The HTTP status code for the response.
 * @param {Object} error - The error details to include in the response.
 * @returns {Object} The JSON response object.
 */
module.exports.responseFailed = (res, code, error) =>
    res.status(code).json({
        status: 'Failed',  // Indicates the failure of the operation
        code,              // HTTP status code
        message: '',       // No message for failed responses
        payload: {},       // Empty payload for failed responses
        error              // Error details for the response
    });
