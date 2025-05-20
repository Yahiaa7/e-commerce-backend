// Importing required Sequelize models
const { Sequelize, sequelize } = require('../models');
const { eventEmitter } = require('../utils/eventEmitter'); // EventEmitter for handling application-wide events
// Function to handle database connection and synchronization
exports.dbConnection = async () => {
    try {
        // Attempt to authenticate the connection to the database
        await sequelize.authenticate();
        console.log('DB Connected Successfully!');

        // Sync the Sequelize models with the database (without forcefully dropping tables)
        await sequelize.sync({ force: false });
        console.log('DB Synced!'); // Logs successful synchronization
    } catch (err) {
        // Handling specific types of errors during authentication or syncing
        if (err instanceof Sequelize.ConnectionError) console.log('Error Authenticating DB:', err);
        else if (err instanceof Sequelize.DatabaseError) console.log('Error Syncing DB:', err);
        else console.log('Unknown error during authentication and syncing with Sequelize:', err);

        // Gracefully shut down if database connection fails
        emitter.emit('serverShutdown', {
            source: 'DatabaseConnection',
            message: 'Error during database initialization',
            details: err.message,
        });
    }


    // Graceful shutdown handler for database resources
    eventEmitter.on('dbShutdown', async ({ resolve, reject }) => {
        console.log('Initiating database shutdown...');
        // Shutdown database connection
        try {
            console.log('Closing database connection...');
            await sequelize.close();
            console.log('Database connection closed.');
            resolve();
        } catch (error) {
            console.error('Error while closing database connection:', error.message);
            reject(error);
        }
    });
};