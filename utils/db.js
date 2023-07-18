const { sequelize } = require('../models/index.model');

exports.dbConnection = async () => {
    await sequelize.authenticate().then(async () => {
        console.log('DB Connected Successfully!');
        await sequelize.sync({ force: false }).then(() => {
            console.log('DB Synced!');
        }).catch((err) => {
            console.log(`Error Syncing DB: \n${err}`);
        });
    }).catch((err) => {
        console.log(`Error Connecting to DB: \n${err}`);
    });
};