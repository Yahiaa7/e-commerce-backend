const app = require('express').Router();
const { authMiddleware } = require('../middleware');
const { adminController } = require('../controllers');

// Users CRUD routes
app.get('/', adminController.getUsers);

app.get('/add', adminController.getAddUser);

app.post('/add', [authMiddleware.imageUploadUser, authMiddleware.checkDuplicateUser], adminController.postAddUser);

app.get('/:id', adminController.getViewUser);

app.get('/update/:id', adminController.getUpdateUser);

app.post('/update/:id', authMiddleware.imageUploadUser, adminController.putUpdateUser);

app.get('/delete/:id', adminController.deleteUser);

app.put('/setStatus/:id', adminController.setStatus);

module.exports = app;