const app = require('express').Router();
const { apiController: { productsController } } = require('../../controllers');
const { getProductsSchema } = require('../../utils/schemas');


app.get('/', getProductsSchema, productsController.getProducts);

module.exports = app;