const app = require('express').Router();
const { dashboardMiddleware: { authMiddleware } } = require('../../middleware');
const { dashboardController: { homeController } } = require('../../controllers');

// Error routes
app.use(require('./error.routes'));

// Auth routes
app.use('/auth', require('./auth.routes'));

// middleware to check if logged in
app.use(authMiddleware.isLoggedIn);

// home route
app.get('/', homeController.getHome);

// Users CRUD routes
app.use('/users',
    authMiddleware.hasAccess([authMiddleware.isAdmin]),
    require('./users.routes.js')
);

// Suppliers CRUD routes
app.use('/suppliers',
    authMiddleware.hasAccess(
        [authMiddleware.isAdmin, authMiddleware.isStoreManager]),
    require('./suppliers.routes.js')
);

// Categories CRUD routes
app.use('/categories',
    authMiddleware.hasAccess(
        [authMiddleware.isAdmin, authMiddleware.isStoreManager]),
    require('./categories.routes')
);

// Products CRUD routes
app.use('/products',
    authMiddleware.hasAccess(
        [authMiddleware.isAdmin, authMiddleware.isStoreManager]),
    require('./products.routes.js')
);

// Advertisement CRUD routes
app.use('/ads',
    authMiddleware.hasAccess(
        [authMiddleware.isAdmin, authMiddleware.isAdvertisingManager]),
    require('./ads.routes.js')
);

// Monthly Expenses CRUD routes
app.use('/me',
    authMiddleware.hasAccess(
        [authMiddleware.isAdmin, authMiddleware.isStoreManager]),
    require('./monthlyExpenses.routes.js')
);

// for any other route, that is not handled!
app.use('*', (req, res) => res.redirect('/dashboard/404'));

module.exports = app;