const { checkSchema } = require("express-validator");
const { Supplier } = require('../../models');

exports.supplierSchema = checkSchema({
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
    commercial_number: {
        in: "body",
        exists: {
            errorMessage: 'Commercial number is required!',
            options: { values: 'falsy' },
            bail: true
        },
        isInt: {
            errorMessage: 'Commercial number must be integer value!',
            bail: true
        },
        custom: {
            options: async (commercial_number) => {
                let supplier = await Supplier.findOne({ where: { commercial_number } });
                if (supplier) {
                    return Promise.reject('Conflict, a supplier with the same commercial number already exists :(');
                }
            },
            bail: true
        }
    },
    birthday: {
        optional: { options: { values: "falsy" } },
        isDate: {
            options: (value) => {
                const validDateFormat = /^(19|20)\d\d[- /.](0?[1-9]|1[012])[- /.](0?[1-9]|[12][0-9]|3[01])$/;
                if (!value.match(validDateFormat)) return Promise.reject('invalid birthday value!');
            },
            errorMessage: 'invalid birthday value!',
            bail: true
        },
    },
    gender: {
        exists: {
            errorMessage: 'gender is required!',
            options: { values: 'falsy' },
            bail: true
        },
        isIn: {
            options: [['Male', 'Female']],
            errorMessage: 'invalid gender value!',
            bail: true
        },
    },
    phone: {
        optional: { options: { values: "falsy" } },
        isMobilePhone: {
            errorMessage: 'invalid phone number!',
            bail: true
        },
    },
    email_address: {
        in: "body",
        optional: { options: { values: "falsy" } },
        isEmail: {
            errorMessage: 'invalid email format!!',
        },
    },
    description: {
        optional: { options: { values: "falsy" } },
        isString: {
            errorMessage: 'description must be string value!',
            bail: true
        },
    }
});

