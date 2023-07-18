const { Sequelize, DataTypes } = require('sequelize');
const dbConfig = require('../configs/db.config');

const sequelize = new Sequelize(
    dbConfig.NAME,
    dbConfig.USER,
    dbConfig.PASS,
    {
        host: dbConfig.HOST,
        dialect: dbConfig.DIALECT,
        logging: false
    }
);

const db = {};

db.sequelize = sequelize;
db.models = {};



module.exports = db;