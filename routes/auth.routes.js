const app = require('express').Router();
const { authMiddleware: {
    imageUploadUser,
    checkDuplicateUser,
    authenticateJWT,
    authenticateRefreshToken
} } = require('../middleware');
const { authController } = require('../controllers');

app.post('/signUp', [imageUploadUser, checkDuplicateUser], authController.signUp);
app.post('/signIn', authController.signIn);
app.post('/refreshToken', authenticateRefreshToken, authController.refreshToken);
app.post('/logout', authenticateJWT, authController.logout);

module.exports = app;