const { dbConnection } = require('./utils/db');
const express = require('express');

const app = express();

app.use(
  '/images',
  express.static('public/images/users'),
  express.static('public/images/products'),
  express.json(),
  express.urlencoded({ extended: true }),
);

// DB Connection
dbConnection();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}!`);
});