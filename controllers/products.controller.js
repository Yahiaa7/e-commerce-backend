const { Product, Category, Sequelize } = require('../models');

exports.getProducts = async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const pageSize = parseInt(req.query.pageSize, 10) || 10;

    let products = await Product.findAndCountAll({
        offset: (page - 1) * pageSize,
        limit: pageSize
    });

    return res.render('products.ejs', {
        page,
        pageSize: products.rows.length,
        totalPages: Math.ceil(products.count / pageSize),
        products: products.rows
    });
};

const categoryList = async () => {
    const categories = await Category.findAll();
    return categories.dataValues;
};

exports.getAddProduct = (req, res) => {
    const categories = categoryList();
    res.render('add-product.ejs', { categories, message: '', error_message: '' })
};

exports.postAddProduct = async (req, res) => {
    try {
        // if (req.file) req.body.image = req.file.path;
        let product = await Product.create(req.body);
        return res.render('add-product.ejs', { message: `Success, new ${product.name} added successfully!`, error_message: '' });
    } catch (err) {
        if (err instanceof Sequelize.Error) return res.render('add-product.ejs', {
            message: '',
            error_message: 'Bad Params, error validating your information!'
        });
        else return res.redirect('/dashboard/500');
    }
};

exports.getViewProduct = async (req, res) => {
    try {
        let { id } = req.params;
        if (!id) return res.redirect('/dashboard/404');
        let product = await Product.findByPk(id);
        if (!product) return res.redirect('/dashboard/404');
        // if (user.dataValues.image) user.dataValues.imageUrl = `http://localhost:5000/images/${user.image.split('\\')[3]}`;
        res.render('view-product.ejs', { product: product.dataValues });
    } catch (err) {
        return res.redirect('/dashboard/500');
    }
};

exports.getUpdateProduct = async (req, res) => {
    try {
        let { id } = req.params;
        if (!id) return res.redirect('/dashboard/404');
        let product = await Product.findByPk(id);
        if (!product) return res.redirect('/dashboard/404');
        // if (user.dataValues.image) user.dataValues.imageUrl = `http://localhost:5000/images/${user.image.split('\\')[3]}`;
        return res.render('update-product.ejs', { product: product.dataValues, message: `` });
    } catch (err) {
        return res.redirect('/dashboard/500');
    }
};

exports.putUpdateProduct = async (req, res) => {
    try {
        let { id } = req.params;
        if (!id) return res.redirect('/dashboard/404');
        let product = await Product.findByPk(id);
        if (!product) return res.redirect('/dashboard/404');
        product.set(req.body);
        await product.save();
        // if (user.dataValues.image) user.dataValues.imageUrl = `http://localhost:5000/images/${user.image.split('\\')[3]}`;
        return res.render('update-product.ejs', { product: product.dataValues, message: `${product.name} updated successfully :)` });
    } catch (err) {
        return res.redirect('/dashboard/500');
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        let { id } = req.params;
        if (!id) return res.redirect('/dashboard/404');
        if (id == req.session.uid) return res.redirect('/dashboard/403');
        let product = await Product.findByPk(id);
        if (!product) return res.redirect('/dashboard/404');
        await product.destroy();
        const referringPage = req.header('referer') || '/dashboard/';
        res.redirect(referringPage);
    } catch (err) {
        console.log(err);
        return res.redirect('/dashboard/500');
    }
};