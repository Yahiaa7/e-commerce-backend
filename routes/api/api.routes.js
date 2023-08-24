const app = require('express').Router();

app.get('/test', (req, res) => {
    res.status(200).send('Works :)');
});

// Auth Routes
app.use('/auth', require('./auth.routes'));

// Users Routes
app.use('/users', require('./user.routes'));

// Categories Routes
app.use('/categories', require('./category.routes'));

// Products Routes
app.use('/products', require('./product.routes'));

// Invoices Routes
app.use('/invoices', require('./invoice.routes'));

// for any other route, that is not handled!
app.use('*', (req, res) => res.status(404).json({ message: 'Page Not Found!' }));

module.exports = app;