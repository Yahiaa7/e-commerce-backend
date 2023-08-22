const app = require('express').Router();
const { dashboardMiddleware: { productsMiddleware } } = require('../../middleware');
const { dashboardController: { productsController } } = require('../../controllers');

// Products CRUD routes

app.get('/', productsController.getProducts);

app.get('/add', productsController.getAddProduct);

app.post('/add', productsMiddleware.imageUploadProduct, productsController.postAddProduct);

app.get('/:id', productsController.getViewProduct);

app.get('/update/:id', productsController.getUpdateProduct);

app.post('/update/:id', productsMiddleware.imageUploadProduct, productsController.putUpdateProduct);

app.get('/delete/:id', productsController.deleteProduct);

module.exports = app;