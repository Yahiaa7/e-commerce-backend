const { Sequelize, sequelize } = require('../models');

exports.dbConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('DB Connected Successfully!');
        await sequelize.sync({ force: false });
        console.log('DB Synced!');
    } catch (err) {
        if (err instanceof Sequelize.ConnectionError) console.log('Error Authenticating DB:', err);
        else if (err instanceof Sequelize.DatabaseError) console.log('Error Syncing DB:', err);
        else console.log('Unknown error authentication and syncing sequelize:', err);

    }
};