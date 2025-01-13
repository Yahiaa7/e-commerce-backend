const app = require('express').Router();
const { apiMiddleware:
    { usersMiddleware,
        authMiddleware: { authenticateJWT, hasAccess, isAdmin } } } = require('../../middleware');
const { apiController: { usersController } } = require('../../controllers');

// Linking routes with middlewares and controllers
// get all users
app.get('/', [authenticateJWT, hasAccess(isAdmin)], usersController.getAllUsers);
// get single user by id
app.get('/:id', [authenticateJWT, hasAccess(isAdmin)], usersController.getUser);
// update user by id
app.put('/:id', [authenticateJWT, hasAccess(isAdmin), usersMiddleware.imageUploadUser], usersController.updateUser);
// delete user by id
app.delete('/:id', [authenticateJWT, hasAccess(isAdmin)], usersController.deleteUser);


module.exports = app;