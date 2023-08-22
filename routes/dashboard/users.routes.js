const app = require('express').Router();
const { dashboardMiddleware: { usersMiddleware } } = require('../../middleware');
const { dashboardController: { usersController } } = require('../../controllers');

// Users CRUD routes
app.get('/', usersController.getUsers);

app.get('/add', usersController.getAddUser);

app.post('/add', usersMiddleware.imageUploadUser, usersController.postAddUser);

app.get('/:id', usersController.getViewUser);

app.get('/update/:id', usersController.getUpdateUser);

app.post('/update/:id', usersMiddleware.imageUploadUser, usersController.putUpdateUser);

app.put('/setStatus/:id', usersController.setStatus);

app.get('/delete/:id', usersController.deleteUser);

module.exports = app;