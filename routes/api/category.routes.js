const app = require('express').Router();
const { apiController: { categoriesController } } = require('../../controllers');

app.get('/', categoriesController.getCategories);

module.exports = app;