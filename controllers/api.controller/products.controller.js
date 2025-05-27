const { validationResult } = require('express-validator');
const { User, Product, ProductRatings, ProductImages, Category, Advertisement, Invoice, InvoiceItem, Sequelize, Op } = require('../../models');
const { responseSuccess, responseFailed } = require("../../utils/responseReturn");
const moment = require('moment');

exports.getProducts = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return responseFailed(res, 401, {
            error_message: "Invalid query params", error: errors.array()
        });

        const page = req.query.page > 0 ? (parseInt(req.query.page, 10) || 1) : 1;
        const pageSize = req.query.pageSize > 0 ? (parseInt(req.query.pageSize, 10) || 10) : 10;
        // const pageSize = parseInt(req.query.pageSize, 10) || 10;
        const opt = queryOptions(req.query, page, pageSize);
        console.log(opt);
        const products = await Product.findAndCountAll(opt);
        // const products = await Product.findAndCountAll({
        //     where: {
        //         quantity: { [Op.gt]: 0 },

        //     },
        //     include: [
        //         { model: Category, attributes: ['name'], required: true },
        //         { model: ProductImages, attributes: ['name'], separate: true, limit: 1  },
        //         {
        //             model: ProductRatings,
        //             attributes: []
        //         },
        //         { model: Advertisement, separate: true }
        //     ],
        //     group: ['Product.id'],
        //     subQuery: false,
        //     offset: (page - 1) * pageSize,
        //     limit: pageSize
        // });

        return responseSuccess(res, 200, {
            page,
            pageSize: pageSize,
            currentPageSize: products.rows.length,
            totalPages: Math.ceil(products.count.length / pageSize),
            products: products.rows
        });
    } catch (err) {
        console.log(err);
        if (err instanceof Sequelize.Error) return responseFailed(res, 400, {
            error_message: 'Error retrieving data!',
            error: err.message
        });
        else return responseFailed(res, 500, { error_message: 'Internal Error', error: err.message });
    }
};


const queryOptions = (queryParams, page, pageSize) => {
    const { query, cat, ads, minPrice, maxPrice } = queryParams;

    const options = {
        attributes: {
            include: [[
                Sequelize.fn('COALESCE',
                    Sequelize.fn('AVG', Sequelize.col('ProductRatings.rate')), 0), 'rate'
            ]],
        },
        where: {
            quantity: { [Op.gt]: 0 },
        },
        include: [
            { model: Category, attributes: ['name'], required: true },
            { model: ProductImages, attributes: ['name'], limit: 1 },
            {
                model: ProductRatings,
                attributes: []
            },
            // {
            //     model: Advertisement, separate: true, where: {
            //         status: 'Active',
            //         toDate: { [Op.gte]: moment().format('YYYY-MM-DD') },
            //     }
            // }
        ],
        group: ['Product.id'],
        subQuery: false,
        offset: (page - 1) * pageSize,
        limit: pageSize
    };

    if (query && (!cat && !ads && !minPrice && !maxPrice)) {
        options.where[Op.or] = [
            { name: { [Op.like]: `%${query}%`, } },
            { '$Category.name$': { [Op.like]: `%${query}%` } }
        ];
    } else {
        if (cat) options.where['$Category.name$'] = cat.match(/[a-zA-Z\d]+/g);
        if (ads) {
            options.include.push({
                model: Advertisement, separate: true, where: {
                    status: 'Active',
                    toDate: { [Op.gte]: moment().format('YYYY-MM-DD') },
                }
            });
        }
        if (minPrice) options.where.price = { [Op.gte]: minPrice };
        if (minPrice && maxPrice) options.where.price[Op.lte] = maxPrice;
        else if (maxPrice) options.where.price = { [Op.lte]: maxPrice };
        if (query) options.where.name = { [Op.like]: `%${query}%`, };
    }
    // if (minPrice && maxPrice) options.where.price = { [Op.between]: [minPrice, maxPrice] }; 
    return options;
};
// hi

exports.getMostPopularProducts = async (req, res) => {
    try {
        // const errors = validationResult(req);
        // if (!errors.isEmpty()) return responseFailed(res, 401, {
        //     error_message: "Invalid query params", error: errors.array()
        // });

        const page = req.query.page > 0 ? (parseInt(req.query.page, 10) || 1) : 1;
        const pageSize = req.query.pageSize > 0 ? (parseInt(req.query.pageSize, 10) || 10) : 10;
        // const pageSize = parseInt(req.query.pageSize, 10) || 10;

        // const count = await Product.count();
        const products = await Product.findAndCountAll({
            attributes: {
                include: [[
                    Sequelize.fn('COALESCE',
                        Sequelize.fn('SUM', Sequelize.col('InvoiceItems.quantity')), 0), 'sold'
                ]],
            },
            include: [
                { model: ProductImages, limit: 1 },
                { model: Category, attributes: [['name', 'categoryName']], required: true },
                { model: InvoiceItem, attributes: [] },
            ],
            group: ['id'],
            order: [['sold', 'DESC']],
            subQuery: false,
            offset: (page - 1) * pageSize,
            limit: pageSize,
            // raw: true
        });
        return responseSuccess(res, 200, {
            page,
            pageSize: pageSize,
            currentPageSize: products.rows.length,
            totalPages: Math.ceil(products.count.length / pageSize),
            products: products.rows
        });
    } catch (err) {
        console.log(err);
        if (err instanceof Sequelize.Error) return responseFailed(res, 400, {
            error_message: 'Error retrieving data!',
            error: err.message
        });
        else return responseFailed(res, 500, { error_message: 'Internal Error', error: err.message });
    }
};

exports.rateProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.body.product_id);
        if (!product) return responseFailed(res, 404, { error_message: 'Product not found!' });
        const user = await User.findByPk(req.tokenInfo.id);
        let rate = await ProductRatings.findOne({ where: { user_id: user.id, product_id: product.id } });
        if (rate) return responseFailed(res, 401, { error_message: 'You can only rate the same product once!' });
        rate = await user.createProductRating(req.body);
        return responseSuccess(res, 200, { rate }, 'Rate added Successfully!');
    } catch (err) {
        if (err instanceof Sequelize.Error) return responseFailed(res, 400, {
            error_message: 'Error validation your data!',
            error: err.message
        });
        else return responseFailed(res, 500, {
            error_message: 'Internal error, please try again later!',
            error: err.message
        });
    }
};

exports.buyProduct = async (req, res) => {
    try {
        const { name, data } = req.body;
        const productsIds = data.map(obj => obj.product_id);
        // check if all products from req.body exists
        const products = await Product.findAll({ where: { id: productsIds } });
        // return error if not all products exists
        if (products.length != productsIds.length) return responseFailed(res, 401, {
            error_message: 'Please provide a valid products!'
        });
        // check if there is enough quantity for each product
        const isValid = data.every(obj =>
            products.some(product => product.id === obj.product_id && obj.quantity <= product.quantity)
        );
        // return error if any of the quantities is more than what actually exists
        if (!isValid) return responseFailed(res, 400, {
            error_message: 'Error, some of the needed products quantities is insufficient'
        });
        const user = await User.findByPk(req.tokenInfo.id);
        const invoice = await user.createInvoice({ name, date: moment().format('YYYY-MM-DD') });
        // console.log(Object.keys(user.__proto__));
        // let total = 0;
        await Promise.all(data.map(async (invoiceItem) => {
            // find the corresponding product
            const product = products.find(product => product.id === invoiceItem.product_id);
            // calculate subtotal
            invoiceItem.subtotal = product.price * invoiceItem.quantity;
            // total += invoiceItem.subtotal;
            // create invoiceItem
            await invoice.createInvoiceItem(invoiceItem, { Product });
            // update products quantity
            // await product.set({ quantity: product.quantity - invoiceItem.quantity });
            await product.decrement({ quantity: invoiceItem.quantity });
            await product.save();
        }));

        invoice.dataValues.InvoiceItems = await invoice.getInvoiceItems();

        return responseSuccess(res, 200, { invoice }, 'Nice!');
    } catch (err) {
        if (err instanceof Sequelize.Error) return responseFailed(res, 400, {
            error_message: 'Error validation your data!',
            error: err.message
        });
        else return responseFailed(res, 500, {
            error_message: 'Internal error, please try again later!',
            error: err.message
        });
    }
};

exports.productDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByPk(id, {
            include: [
                { model: Category, attributes: ['name'] },
                { model: ProductImages, attributes: ['name'] },
            ]
        });
        if (!product) return responseFailed(res, 404, { error_message: 'NOT FOUND, Invalid product!' });
        return responseSuccess(res, 200, { product }, 'Product found!');
    } catch (err) {
        if (err instanceof Sequelize.Error) return responseFailed(res, 400, {
            error_message: 'Error retrieving product info!',
            error: err.message
        });
        else return responseFailed(res, 500, {
            error_message: 'Internal Error, please try again later!',
            error: err.message
        });
    }
};