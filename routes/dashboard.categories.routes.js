const app = require('express').Router();
const { authMiddleware } = require('../middleware');
const { categoriesController } = require('../controllers');

// Categories CRUD routes

app.get('/', categoriesController.getCategories);

app.get('/add', categoriesController.getAddCategory);

app.post('/add', categoriesController.postAddCategory);

app.get('/:id', categoriesController.getCategoryWithProducts);

app.get('/update/:id', categoriesController.getUpdateCategory);

app.post('/update/:id', categoriesController.putUpdateCategory);

app.get('/delete/:id', categoriesController.deleteCategory);

module.exports = app;