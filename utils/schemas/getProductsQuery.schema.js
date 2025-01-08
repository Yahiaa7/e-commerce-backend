const { checkSchema } = require('express-validator');


// validating incoming quires to formatted corrected
exports.getProductsSchema = checkSchema({
    query: {
        in: 'query',
        optional: { options: { values: 'falsy' } },
        // isString: {
        //     errorMessage: 'query must be string!',
        //     bail: true
        // }
        isString: true
    },
    cat: {
        in: 'query',
        optional: { options: { values: 'falsy' } },
        isString: {
            errorMessage: 'cat must be string!',
            bail: true
        },
    },
    minPrice: {
        in: 'query',
        optional: { options: { values: 'falsy' } },
        isFloat: {
            errorMessage: 'minPrice must be a float positive value!',
            options: { min: 0 },
            bail: true
        }
    },
    maxPrice: {
        in: 'query',
        optional: { options: { values: 'falsy' } },
        isFloat: {
            options: { min: 0 },
            errorMessage: 'maxPrice must be a float positive value!',
            bail: true
        },
        custom: {
            options: (maxPrice, { req }) => {
                if (req.query.minPrice && parseFloat(maxPrice) <= parseFloat(req.query.minPrice)) {
                    return Promise.reject("maxPrice can't be less or equal the minPrice!");
                }
                return true;
            },
            bail: true,
        }
    },
    ads: {
        in: 'query',
        optional: { options: { values: 'falsy' } },
        isBoolean: {
            errorMessage: 'ads must be boolean!',
            bail: true
        },
    },
});