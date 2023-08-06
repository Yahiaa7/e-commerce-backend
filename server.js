const { dbConnection } = require('./utils/db');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const express = require('express');
const ejsLayout = require('express-ejs-layouts')
const app = express();

app.use(
  '/images',
  express.static('public/images/users'),
  express.static('public/images/products'),
<<<<<<< HEAD
=======
  express.json(),
  express.urlencoded({ extended: true }),
>>>>>>> migration_associations
);

app.use(
  '/public',
  express.static('public')
);

// app.use(express.static('public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.CK));
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

// app.use(ejsLayout);
// app.set('layout', './layouts/layout')
app.set('view engine', 'ejs');


// DB Connection
dbConnection();

// linking routes
app.use('/api', require('./routes/index.routes'));
<<<<<<< HEAD
app.use('/dashboard', require('./routes/dashboard.routes'));
=======
>>>>>>> migration_associations

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}!`);
});