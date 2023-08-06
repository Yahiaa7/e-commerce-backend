const app = require('express').Router();
const { authMiddleware } = require('../middleware');
const { productsController } = require('../controllers');

// Products CRUD routes

app.get('/', productsController.getProducts);

app.get('/add', productsController.getAddProduct);

// authMiddleware.imageUploadProduct
app.post('/add', productsController.postAddProduct);

app.get('/:id', productsController.getViewProduct);

// authMiddleware.imageUploadProduct
app.get('/update/:id', productsController.getUpdateProduct);

app.post('/update/:id', productsController.putUpdateProduct);

app.get('/delete/:id', productsController.deleteProduct);

module.exports = app;