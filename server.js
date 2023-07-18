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

// sequelize model:generate --name Supplier --attributes "name:string,birthday:date,gender:enum,phone:string,email_address:string,image:string,description:string"
// sequelize model:generate --name Category --attributes "name:string,description:string"
// sequelize model:generate --name Product --attributes "name:string,description:string,price:float,quantity:integer"
// sequelize model:generate --name ProductImages --attributes "path:string"
// sequelize model:generate --name ProductRatings --attributes "rate:string,description:string"
// sequelize model:generate --name Advertisement --attributes "newPrice:float,fromDate:date,toDate:date,status:string"
// sequelize model:generate --name MonthlyExpenses --attributes "name:string,price:float,date:date"
// sequelize model:generate --name Invoice --attributes "name:string,date:date"
// sequelize model:generate --name InvoiceItem --attributes "quantity:integer,subtotal:float"