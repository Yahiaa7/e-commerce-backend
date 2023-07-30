const app = require('express').Router();
const { authMiddleware } = require('../middleware');
const { adminController, usersController } = require('../controllers');

app.get('/adminLogin', adminController.getAdminLogin);

app.post('/adminLogin', adminController.postAdminLogin);

app.get('/', (req, res) => {
    res.render('index.ejs');
});

module.exports = app;