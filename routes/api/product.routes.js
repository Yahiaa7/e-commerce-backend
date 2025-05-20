const app = require('express').Router();
const { apiController: { productsController } } = require('../../controllers');
const { apiMiddleware: { authMiddleware: { authenticateJWT } } } = require('../../middleware');
const { getProductsSchema } = require('../../utils/schemas');


app.get('/', getProductsSchema, productsController.getProducts);

app.get('/popular', productsController.getMostPopularProducts);

app.get('/:id', productsController.productDetails);

app.use(authenticateJWT);

app.post('/rate', productsController.rateProduct);

app.post('/buy', productsController.buyProduct);

app.post('/buy', productsController.buyProduct);



module.exports = app;