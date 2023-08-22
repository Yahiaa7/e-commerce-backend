const { dbConnection } = require('./utils/db');
const express = require('express');

// initializing our express app
const app = express();

// DB Connection
dbConnection();

// setting our view engine
app.set('view engine', 'ejs');

// linking routes
app.use(require('./routes'));

// Port Setup
const PORT = process.env.PORT || 5000;

// Starting Server
app.listen(PORT, () => console.log(`Server started at port ${PORT}!`));


// get categories
// get products depending on checkQuantity in query params
// productFiltered, singleEndpoint or depending on (category, price range, advertisement, most popular)
// product search (product name and category name)



