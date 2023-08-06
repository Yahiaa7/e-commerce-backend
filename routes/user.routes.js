const app = require('express').Router();
const { authMiddleware: { authenticateJWT, isAdmin, imageUploadUser } } = require('../middleware');
const { usersController } = require('../controllers');

// get all users
app.get('/', [authenticateJWT, isAdmin], usersController.getAllUsers);
// get single user by id
app.get('/:id', [authenticateJWT, isAdmin], usersController.getUser);
// update user by id
app.put('/update/:id', [authenticateJWT, isAdmin, imageUploadUser], usersController.updateUser);
// delete user by id
app.delete('/delete/:id', [authenticateJWT, isAdmin], usersController.deleteUser);

module.exports = app;