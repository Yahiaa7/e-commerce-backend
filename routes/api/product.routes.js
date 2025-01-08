const app = require('express').Router();
const { apiController: { productsController } } = require('../../controllers');
const { apiMiddleware: { authMiddleware: { authenticateJWT } } } = require('../../middleware');
const { getProductsSchema } = require('../../utils/schemas');

// Liking all product related routes with their corresponding middlewares and controllers

// get all products, having a product schema validating the format of any queries coming with request
app.get('/', getProductsSchema, productsController.getProducts);

// rate a product which requires user authentication
app.post('/rate', authenticateJWT, productsController.rateProduct);

// buying a product
app.post('/buy', authenticateJWT, productsController.buyProduct);


module.exports = app;