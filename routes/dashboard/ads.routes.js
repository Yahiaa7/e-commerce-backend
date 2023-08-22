const app = require('express').Router();
const { dashboardController: { adsController } } = require('../../controllers');

// Advertisements CRUD routes

app.get('/', adsController.getAllAds);

app.get('/add', adsController.getAddAds);

app.post('/add', adsController.postAddAds);

app.get('/:id', adsController.getAds);

app.get('/update/:id', adsController.getUpdateAds);

app.post('/update/:id', adsController.putUpdateAds);

app.get('/delete/:id', adsController.deleteAds);

module.exports = app;