const app = require('express').Router();
const { apiMiddleware: { authMiddleware, usersMiddleware } } = require('../../middleware');
const { apiController: { authController } } = require('../../controllers');

// Route to handle user sign-up
// It first uploads the user's image, then validates the user data before proceeding with sign-up
app.post('/signup',
    [
        usersMiddleware.imageUploadUser,
        usersMiddleware.validateUser
    ],
    authController.signUp);


// Route to handle user sign-in
// This route directly invokes the signIn function in the controller to authenticate the user and issue a token
app.post('/signIn', authController.signIn);


// Route to refresh the authentication JWT
// The middleware 'authenticateRefreshToken' checks the validity of the refresh token before refreshing the JWT
app.post('/refreshToken', authMiddleware.authenticateRefreshToken, authController.refreshToken);


// Route to handle user sign-out
// The 'authenticateJWT' middleware ensures the user is logged in before they can sign out
app.post('/signout', authMiddleware.authenticateJWT, authController.signout);

module.exports = app;
