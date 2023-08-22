const errorController = require('./error.controller');
const authController = require('./auth.controller');
const usersController = require('./users.controller');
const categoriesController = require('./categories.controller');
const productsController = require('./products.controller');
const suppliersController = require('./supplier.controller');
const adsController = require('./ads.controller');
const monthlyExpensesController = require('./monthlyExpenses.controller');
const homeController = require('./home.controller');

module.exports = {
    errorController,
    authController,
    usersController,
    categoriesController,
    productsController,
    suppliersController,
    adsController,
    monthlyExpensesController,
    homeController
};