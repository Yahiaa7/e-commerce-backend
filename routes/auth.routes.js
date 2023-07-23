const app = require('express').Router();
const { authMiddleware } = require('../middleware');
const { authController } = require('../controllers');

app.post('/signUp', [authMiddleware.imageUploadUser, authMiddleware.checkDuplicateUser], authController.signUp);
app.post('/signIn', authController.signIn);
app.post('/refreshToken', authController.refreshToken);

module.exports = app;