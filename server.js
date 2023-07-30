const { dbConnection } = require('./utils/db');
const cookieParser = require('cookie-parser');
const express = require('express');

const app = express();

app.use(
  '/images',
  express.static('public/images/users'),
  express.static('public/images/products'),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.CK));

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/views'));

// DB Connection
dbConnection();

// linking routes
app.use('/api', require('./routes/index.routes'));
app.use('/dashboard', require('./routes/dashboard.routes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}!`);
});