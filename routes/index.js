const session = require('express-session');
const express = require('express');
const app = express.Router();

// Serving static images for users and products
app.use(
    '/images',
    express.static('public/images/users'),
    express.static('public/images/products')
);

// Middleware for parsing JSON and URL-encoded requests
app.use(
    express.json(),
    express.urlencoded({ extended: true }),
);

// Linking API routes
app.use('/api', require('./api/api.routes'));

// Session initialization with secure configurations for production environments
app.use(session({
    secret: process.env.SK,
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000,    // 24 hours
        secure: process.env.NODE_ENV === 'production',   // Enable secure cookies in production
        httpOnly: true,
        sameSite: 'strict'
    },
}));

// Serving static assets required by views
app.use('/public', express.static('public'));

// Linking dashboard routes
app.use('/dashboard', require('./dashboard/dashboard.routes'));

// Handling 404 for undefined routes
app.all('*', (req, res) => res.status(404).json({ message: 'Page Not Found!' }));

// Centralized error handler (Optional)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

module.exports = app;