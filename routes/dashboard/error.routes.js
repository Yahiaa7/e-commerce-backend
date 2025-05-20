const app = require('express').Router();
const { dashboardController: { errorController } } = require('../../controllers');

// Error routes
// display the 403 unauthorized page
app.get('/403', errorController.get403);

// display the 404 Not Found page
app.get('/404', errorController.get404);

// display the 500 Internal Server Error page
app.get('/500', errorController.get500);

module.exports = app;