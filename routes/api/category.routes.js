const app = require('express').Router();
const { apiController: { categoriesController } } = require('../../controllers');

// retrieving the category list
app.get('/', categoriesController.getCategories);

module.exports = app;