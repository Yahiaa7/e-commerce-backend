const app = require('express').Router();
const { dashboardController: { authController } } = require('../../controllers');
const { authMiddleware } = require('../../middleware/dashboard');

// authentication routes
app.get('/login', authController.getLogin);

app.post('/login', authController.postLogin);

app.get('/logout', authMiddleware.isLoggedIn, authController.logout);

module.exports = app;