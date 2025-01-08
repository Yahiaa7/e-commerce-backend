const app = require('express').Router();
const { apiMiddleware:
    { usersMiddleware,
        authMiddleware: { authenticateJWT, isAdmin } } } = require('../../middleware');
const { apiController: { usersController } } = require('../../controllers');

// Linking routes with middlewares and controllers
// get all users
app.get('/', [authenticateJWT, isAdmin], usersController.getAllUsers);
// get single user by id
app.get('/:id', [authenticateJWT, isAdmin], usersController.getUser);
// update user by id
app.put('/:id', [authenticateJWT, isAdmin, usersMiddleware.imageUploadUser], usersController.updateUser);
// delete user by id
app.delete('/:id', [authenticateJWT, isAdmin], usersController.deleteUser);


module.exports = app;