const { checkSchema } = require("express-validator");
const { User } = require('../../models');

exports.userUpSchema = checkSchema({
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
    username: {
        in: "body",
        exists: {
            errorMessage: 'username is required!',
            options: { values: 'falsy' },
            bail: true
        },
        isString: {
            errorMessage: 'username must be string value!',
            bail: true
        },
        custom: {
            options: async (username) => {
                let user = await User.findOne({ where: { username } });
                
                if (user.username !== username && user) {
                    return Promise.reject('Conflict, a user with the same username already exists :(');
                }
            },
            bail: true
        }
    },
    // password: {
    //     exists: {
    //         errorMessage: 'password is required!',
    //         options: { values: 'falsy' },
    //         bail: true
    //     },
    //     isStrongPassword: {
    //         errorMessage: 'password must be strong!(uppercase, lowercase, digits, special characters)',
    //         bail: true
    //     },
    // },
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
    },
    role: {
        exists: {
            errorMessage: 'role is required!',
            options: { values: 'falsy' },
            bail: true
        },
        isIn: {
            options: [['Admin', 'Store Manager', 'Advertising Manager', 'User']],
            errorMessage: 'invalid role value!',
            bail: true
        }
    },
    status: {
        exists: {
            options: { values: 'falsy' },
            errorMessage: 'status is required!',
            bail: true
        },
        isIn: {
            options: [['Active', 'Pending', 'Inactive']],
            errorMessage: 'invalid status value!',
            bail: true
        }
    }
});

