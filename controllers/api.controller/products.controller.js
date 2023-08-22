const { validationResult } = require('express-validator');
const { Product, Category, Advertisement, Sequelize, Op } = require('../../models');
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

        const products = await Product.findAndCountAll(queryOptions(req.query, page, pageSize));
        
        return responseSuccess(res, 200, {
            page,
            pageSize: pageSize,
            currentPageSize: products.rows.length,
            totalPages: Math.ceil(products.count / pageSize),
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
        where: {},
        include: [{ model: Category, attributes: ['name'], required: true },],
        subQuery: false,
        offset: (page - 1) * pageSize,
        limit: pageSize
    };

    if (query && (!cat || !ads || !minPrice || !maxPrice)) {
        options.where[Op.or] = [
            { name: { [Op.like]: `%${query}%`, } },
            { '$Category.name$': { [Op.like]: `%${query}%` } }
        ];
    } else {
        if (cat) options.where['$Category.name$'] = cat.match(/[a-zA-Z\d]+/g);
        if (ads) {
            options.where['$Advertisements.status$'] = 'Active';
            options.where['$Advertisements.toDate$'] = { [Op.gte]: moment().format('YYYY-MM-DD') };
            options.include.push({ model: Advertisement, required: true });
        }
        if (minPrice) options.where.price = { [Op.gte]: minPrice };
        if (minPrice && maxPrice) options.where.price[Op.lte] = maxPrice;
        else if (maxPrice) options.where.price = { [Op.lte]: maxPrice };
        if (query) options.where.name = { [Op.like]: `%${query}%`, };
    }
    // if (minPrice && maxPrice) options.where.price = { [Op.between]: [minPrice, maxPrice] }; 
    return options;
};