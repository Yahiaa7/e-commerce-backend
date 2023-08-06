const app = require('express').Router();
const { authMiddleware } = require('../middleware');
const { adminController } = require('../controllers');

// Error routes
app.get('/403', adminController.get403);

app.get('/404', adminController.get404);

app.get('/500', adminController.get500);

// authentication routes
app.get('/login', adminController.getLogin);

app.post('/login', adminController.postLogin);

// middleware to check if not logged in
// app.use(authMiddleware.isLoggedIn);

// home route
app.get('/', adminController.getHome);

// Users CRUD routes
app.use('/users', require('./dashboard.users.routes.js'));

// Categories CRUD routes
app.use('/categories', require('./dashboard.categories.routes'));

// Products CRUD routes
app.use('/products', require('./dashboard.products.routes.js'));

module.exports = app;