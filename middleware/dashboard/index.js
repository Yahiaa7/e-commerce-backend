const authMiddleware = require('./auth.middleware');
const usersMiddleware = require('./users.middleware');
const productsMiddleware = require('./products.middleware');


module.exports = {
    authMiddleware,
    usersMiddleware,
    productsMiddleware,
}