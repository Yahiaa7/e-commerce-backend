const { checkSchema } = require("express-validator");
const { Product, Category, Supplier } = require('../../models');

exports.productSchema = checkSchema({
    name: {
        exists: {
            errorMessage: 'name is required!',
            options: { values: 'falsy' },
            bail: true
        },
        isString: {
            errorMessage: 'name must be string value!',
            bail: true
        },
    },
    description: {
        optional: { options: { values: "falsy" } },
        isString: {
            errorMessage: 'description must be string value!',
            bail: true
        },
    },
    price: {
        exists: {
            errorMessage: 'price is required!',
            options: { values: 'falsy' },
            bail: true
        },
        isFloat: {
            errorMessage: 'price must be float value!',
            bail: true
        },
    },
    quantity: {
        exists: {
            errorMessage: 'quantity is required!',
            options: { values: 'falsy' },
            bail: true
        },
        isInt: {
            errorMessage: 'quantity must be integer value!',
            bail: true
        },
    },
    category_id: {
        exists: {
            errorMessage: 'category is required!',
            options: { values: 'falsy' },
            bail: true
        },
        isInt: {
            errorMessage: 'category must be integer value!',
            bail: true
        },
        custom: {
            options: async (category_id) => {
                let category = await Category.findByPk(category_id);
                if (!category) return Promise.reject('Invalid category!');
            },
            bail: true
        }
    },
    supplier_id: {
        exists: {
            errorMessage: 'supplier is required!',
            options: { values: 'falsy' },
            bail: true
        },
        isInt: {
            errorMessage: 'supplier must be integer value!',
            bail: true
        },
        custom: {
            options: async (supplier_id) => {
                let supplier = await Supplier.findByPk(supplier_id);
                if (!supplier) return Promise.reject('Invalid supplier!');
            },
            bail: true
        }
    }
});

