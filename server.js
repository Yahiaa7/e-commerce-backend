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


 // console.log(Object.keys(user.__proto__));

// get categories
// get products depending on checkQuantity in query params
// productFiltered, singleEndpoint or depending on (category, price range, advertisement, most popular)
// product search (product name and category name)


// authentication required,
// product ratings, check (user can only rate the same product once), return productRating created object

// invoice, make endpoint (buy or whatever), array of products in req.body
// user details, to create the Invoice through this user, 
// check all products from req.body exists
// check each product quantity with each invoiceItem quantity
// create invoice with all invoice items,
// update each product quantity 
// response, full invoice, with list of products 


// myInvoices, InvoiceDetails