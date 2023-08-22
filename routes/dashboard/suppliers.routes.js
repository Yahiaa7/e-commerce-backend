const { dashboardController: { suppliersController } } = require('../../controllers');
const { dashboardMiddleware:{usersMiddleware} } = require('../../middleware');

const app = require('express').Router();

// Supplier CRUD routes
app.get('/', suppliersController.getSuppliers);

app.get('/add', suppliersController.getAddSupplier);

// authMiddleware.checkDuplicateSupplier
app.post('/add', [usersMiddleware.imageUploadUser], suppliersController.postAddSupplier);

app.get('/:id', suppliersController.getViewSupplier);

app.get('/update/:id', suppliersController.getUpdateSupplier);

app.post('/update/:id', usersMiddleware.imageUploadUser, suppliersController.putUpdateSupplier);

app.get('/delete/:id', suppliersController.deleteSupplier);

module.exports = app;
