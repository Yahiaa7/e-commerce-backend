// const cookieParser = require('cookie-parser');
const session = require('express-session');
const express = require('express');
const app = express.Router();

// for viewing images thought the server
app.use(
    '/images',
    express.static('public/images/users'),
    express.static('public/images/products')
);

// parsing request body
app.use(
    express.json(),
    express.urlencoded({ extended: true }),
    // cookieParser(process.env.CK)
);

// linking api routes
app.use('/api', require('./api/api.routes'));

// session initialization
app.use(session({
    secret: process.env.SK,
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        // secure: true,            // apply ssl certificate to make the server work on https instead of http 
        httpOnly: true,
        sameSite: 'strict'
    },
}));

// to access all the assets required by the views
app.use(
    '/public',
    express.static('public')
);

// linking dashboard routes
app.use('/dashboard', require('./dashboard/dashboard.routes'));

// for any other route, that is not handled!
app.use('*', (req, res) => res.status(404).json({ message: 'Page Not Found!' }));

module.exports = app;