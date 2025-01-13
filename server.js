// Importing required modules and dependencies
const { dbConnection } = require('./utils/db'); // Handles database connection setup
const express = require('express'); // Express framework for creating the server and handling routes

// Initializing the Express application
const app = express();

// Establishing a connection to the database
dbConnection(); // Connects to the MySQL database using Sequelize ORM

// Setting up EJS as the template engine for rendering views
app.set('view engine', 'ejs');

// Linking the application routes
app.use(require('./routes')); // Middleware to handle all defined routes in the application

// Configuring the server's port
const PORT = process.env.PORT || 5000; // Use environment-defined port or default to 5000

// Starting the server and listening for incoming requests
const server = app.listen(PORT, () => console.log(`Server started at port ${PORT}!`));

// Graceful shutdown handling
process.on('SIGINT', () => {
    console.log("Server shutting down...");
    server.close(() => {
        console.log("Server closed.");
        process.exit(0); // Gracefully exit the process
    });
});
