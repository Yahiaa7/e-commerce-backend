const app = require('express').Router();
const { dashboardController: { errorController } } = require('../../controllers');

// Error routes
app.get('/403', errorController.get403);

app.get('/404', errorController.get404);

app.get('/500', errorController.get500);

module.exports = app;