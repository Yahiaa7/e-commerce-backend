const app = require('express').Router();
const { authMiddleware } = require('../middleware');
const { adminController } = require('../controllers');

// Users CRUD routes
app.get('/', adminController.getUsers);

app.get('/addUser', adminController.getAddUser);

app.post('/addUser', [authMiddleware.imageUploadUser, authMiddleware.checkDuplicateUser], adminController.postAddUser);

app.get('/:id', adminController.getViewUser);

app.get('/updateUser/:id', adminController.getUpdateUser);

app.post('/updateUser/:id', authMiddleware.imageUploadUser, adminController.putUpdateUser);

app.get('/deleteUser/:id', adminController.deleteUser);

module.exports = app;