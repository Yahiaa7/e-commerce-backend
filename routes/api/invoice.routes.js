const app = require('express').Router();
const { apiMiddleware: { authMiddleware: { authenticateJWT } } } = require('../../middleware');
const { apiController: { invoicesController } } = require('../../controllers');

// retrieving user's invoices list 
app.get('/', authenticateJWT, invoicesController.getAllInvoices);

// retrieve a single invoice through it's id
app.get('/:invoiceId', authenticateJWT, invoicesController.getInvoice);

module.exports = app;