const { userSchema } = require('./user.schema');
const { userUpSchema } = require('./userUp.schema');
const { supplierSchema } = require('./supplier.schema');

const { getProductsSchema } = require('./getProductsQuery.schema');

module.exports = {
    userSchema,
    supplierSchema,
    userUpSchema,
    getProductsSchema
}