const app = require('express').Router();
const { apiMiddleware: { authMiddleware: { authenticateJWT } } } = require('../../middleware');
const { apiController: { invoicesController } } = require('../../controllers');

app.get('/', authenticateJWT, invoicesController.getAllInvoices);

app.get('/:invoiceId', authenticateJWT, invoicesController.getInvoice);

module.exports = app;