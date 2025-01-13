const app = require('express').Router(); // Initialize the Express Router to define API routes

// A test route for verifying the application is running correctly
app.get('/test', (req, res) => res.status(200).send('Works :)'));

// Auth Routes: Handles authentication-related endpoints (e.g., login, registration)
app.use('/auth', require('./auth.routes'));

// Users Routes: Handles operations related to user management (e.g., CRUD for users)
app.use('/users', require('./user.routes'));

// Categories Routes: Handles category-related operations (e.g., CRUD for categories)
app.use('/categories', require('./category.routes'));

// Products Routes: Handles operations related to product management (e.g., CRUD for products)
app.use('/products', require('./product.routes'));

// Invoices Routes: Handles operations related to invoices (e.g., generating, viewing invoices)
app.use('/invoices', require('./invoice.routes'));

// Fallback route for any undefined routes (404 error handler)
app.all('*', (req, res) => res.status(404).json({ message: `Page Not Found: ${req.originalUrl}` }));

// Export the router so it can be used in the main app file
module.exports = app;
