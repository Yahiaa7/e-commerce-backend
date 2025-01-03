const app = require('express').Router();
const { apiMiddleware: { authMiddleware, usersMiddleware } } = require('../../middleware');
const { apiController: { authController } } = require('../../controllers');

app.post('/signup',
    [
        usersMiddleware.imageUploadUser,
        usersMiddleware.validateUser
    ],
    authController.signUp);
app.post('/signIn', authController.signIn);
app.post('/refreshToken', authMiddleware.authenticateRefreshToken, authController.refreshToken);
app.post('/signout', authMiddleware.authenticateJWT, authController.signout);

module.exports = app;