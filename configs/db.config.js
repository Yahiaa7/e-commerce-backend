require('dotenv').config();

module.exports = {
    HOST: process.env.DB_HOST,
    USER: process.env.DB_USERNAME,
    PASS: process.env.DB_PASSWORD,
    NAME: process.env.DB_NAME,
    DIALECT: 'mysql'
}