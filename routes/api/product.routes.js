const app = require('express').Router();
const { apiController: { productsController } } = require('../../controllers');
const { apiMiddleware: { authMiddleware: { authenticateJWT } } } = require('../../middleware');
const { getProductsSchema } = require('../../utils/schemas');


app.get('/', getProductsSchema, productsController.getProducts);

app.post('/rate', authenticateJWT, productsController.rateProduct);

app.post('/buy', authenticateJWT, productsController.buyProduct);



module.exports = app;