const app = require('express').Router();
const { isLoggedIn, authMiddleware } = require('../middleware');
const { adminController } = require('../controllers');

// Error routes
app.get('/403', adminController.get403);

app.get('/404', adminController.get404);

app.get('/500', adminController.get500);

// authentication routes
app.get('/adminLogin', adminController.getAdminLogin);

app.post('/adminLogin', adminController.postAdminLogin);

// middleware to check if not logged in
// app.use(isLoggedIn);

// home route
app.get('/', adminController.getHome);

// Users CRUD routes
app.use('/users', require('./dashboard.users.routes.js'));

module.exports = app;