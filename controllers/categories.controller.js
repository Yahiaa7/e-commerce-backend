const { Product, Category, Sequelize } = require('../models');

exports.getCategories = async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const pageSize = parseInt(req.query.pageSize, 10) || 10;

    let categories = await Category.findAndCountAll({
        offset: (page - 1) * pageSize,
        limit: pageSize
    });

    return res.render('categories.ejs', {
        page,
        pageSize: categories.rows.length,
        totalPages: Math.ceil(categories.count / pageSize),
        categories: categories.rows
    });
};

const categoryList = async () => {
    const categories = await Category.findAll();
    return categories.dataValues;
};

exports.getAddCategory = (req, res) => {
    res.render('add-category.ejs', { message: '', error_message: '' })
};

exports.postAddCategory = async (req, res) => {
    try {
        let category = await Category.create(req.body);
        return res.render('add-category.ejs', { message: `Success, new category ${category.name} added successfully!`, error_message: '' });
    } catch (err) {
        console.log(err);
        if (err instanceof Sequelize.Error) return res.render('add-category.ejs', {
            message: '',
            error_message: 'Bad Params, error validating your information!'
        });
        else return res.redirect('/dashboard/500');
    }
};

exports.getCategoryWithProducts = async (req, res) => {
    try {
        let { id } = req.params;
        if (!id) return res.redirect('/dashboard/404');
        let category = await Category.findByPk(id, {
            include: Product
        });
        if (!category) return res.redirect('/dashboard/404');
        console.log(category);
        // if (user.dataValues.image) user.dataValues.imageUrl = `http://localhost:5000/images/${user.image.split('\\')[3]}`;
        res.render('view-category.ejs', { category: category.dataValues });
    } catch (err) {
        console.log(err);
        return res.redirect('/dashboard/500');
    }
};

exports.getUpdateCategory = async (req, res) => {
    try {
        let { id } = req.params;
        if (!id) return res.redirect('/dashboard/404');
        let category = await Category.findByPk(id);
        if (!category) return res.redirect('/dashboard/404');
        // if (user.dataValues.image) user.dataValues.imageUrl = `http://localhost:5000/images/${user.image.split('\\')[3]}`;
        return res.render('update-category.ejs', { category: category.dataValues, message: `` });
    } catch (err) {
        return res.redirect('/dashboard/500');
    }
};

exports.putUpdateCategory = async (req, res) => {
    try {
        let { id } = req.params;
        if (!id) return res.redirect('/dashboard/404');
        let category = await Category.findByPk(id);
        if (!category) return res.redirect('/dashboard/404');
        category.set(req.body);
        await category.save();
        // if (user.dataValues.image) user.dataValues.imageUrl = `http://localhost:5000/images/${user.image.split('\\')[3]}`;
        return res.render('update-category.ejs', { category: category.dataValues, message: `${category.name} updated successfully :)` });
    } catch (err) {
        return res.redirect('/dashboard/500');
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        let { id } = req.params;
        if (!id) return res.redirect('/dashboard/404');
        let category = await Category.findByPk(id);
        if (!category) return res.redirect('/dashboard/404');
        await category.destroy();
        const referringPage = req.header('referer') || '/dashboard/';
        res.redirect(referringPage);
    } catch (err) {
        console.log(err);
        return res.redirect('/dashboard/500');
    }
};