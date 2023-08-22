const app = require('express').Router();
const { apiMiddleware: { authMiddleware, usersMiddleware } } = require('../../middleware');
const { apiController: { authController } } = require('../../controllers');

app.post('/signUp',
    [
        usersMiddleware.imageUploadUser,
        usersMiddleware.validateUser
    ],
    authController.signUp);
app.post('/signIn', authController.signIn);
app.post('/refreshToken', authMiddleware.authenticateRefreshToken, authController.refreshToken);
app.post('/logout', authMiddleware.authenticateJWT, authController.logout);

module.exports = app;