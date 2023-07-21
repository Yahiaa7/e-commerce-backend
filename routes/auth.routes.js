const app = require('express').Router();
const { authMiddleware } = require('../middleware');
const { authController } = require('../controllers');

app.post('/signUp', authMiddleware.checkDuplicateUser, authController.signUp);
app.post('/signIn', authController.signIn);

module.exports = app;