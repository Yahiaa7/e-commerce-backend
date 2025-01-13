const app = require('express').Router();
const { dashboardController: { authController } } = require('../../controllers');
const { authMiddleware } = require('../../middleware/dashboard');

// authentication routes
// view the login page, GET rquest
app.get('/login', authController.getLogin);

// handle the login POST Request
app.post('/login', authController.postLogin);

//here we use the isLoggedIn route to logout authorized users only
app.get('/logout', authMiddleware.isLoggedIn, authController.logout);

module.exports = app;