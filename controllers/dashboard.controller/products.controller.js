const { validationResult } = require('express-validator');
const { Product, Category, User, ProductImages, Supplier, Sequelize } = require('../../models');
const { productSchema } = require('../../utils/schemas/product.schema');
const fs = require('fs/promises');

exports.getProducts = async (req, res) => {
    const page = req.query.page > 0 ? (parseInt(req.query.page, 10) || 1) : 1;
    const pageSize = req.query.pageSize > 0 ? (parseInt(req.query.pageSize, 10) || 10) : 10;
    // const pageSize = parseInt(req.query.pageSize, 10) || 10;

    let products = await Product.findAndCountAll({
        offset: (page - 1) * pageSize,
        limit: pageSize
    });

    return res.render('products.ejs', {
        page,
        pageSize: pageSize,
        currentPageSize: products.rows.length,
        totalPages: Math.ceil(products.count / pageSize),
        products: products.rows
    });
};

const categoryList = async () => {
    const categories = await Category.findAll({ attributes: ['id', 'name'] });
    return categories.map(category => category.toJSON());
};

const supplierList = async () => {
    const suppliers = await Supplier.findAll({ attributes: ['id', 'name'] });
    return suppliers.map(supplier => supplier.toJSON());
};

const saveProductsImages = async (productInstance, images) =>
    await Promise.all(images.map(image => productInstance.createProductImage({
        name: image.filename, destination: image.destination
    })));

const deleteProductsImages = async (removedImages) =>
    await Promise.all(removedImages.split(',').map(name => {
        name = name.split('images/')[1];
        ProductImages.destroy({
            where: { name }
        });
        fs.unlink(`public/images/products/${name}`);
    }));

exports.getAddProduct = async (req, res) => res.render('add-product.ejs',
    {
        categories: await categoryList(),
        suppliers: await supplierList(),
        message: '', error_message: ''
    });

exports.postAddProduct = async (req, res) => {
    const categories = await categoryList();
    const suppliers = await supplierList();
    try {
        await productSchema.run(req);
        const validation = validationResult(req);
        if (validation.errors.length) {
            if (req.files) for (key in req.files) fs.unlink(req.files[key].path);
            return res.render('add-product.ejs', {
                categories,
                suppliers,
                message: '',
                error_message: validation.array().map(error => error.msg)
            });
        }

        let userId = req.session.uid;
        let user = await User.findByPk(userId);

        const product = await user.createProduct(req.body,
            { Category, Supplier }
        );

        if (req.files) await saveProductsImages(product, req.files);

        return res.render('add-product.ejs', {
            categories,
            suppliers,
            message: `Success, new product added successfully!`,
            error_message: ''
        });
    } catch (err) {
        console.log(err);
        if (err instanceof Sequelize.Error) return res.render('add-product.ejs', {
            categories,
            suppliers,
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
        let product = await Product.findByPk(id, {
            include: [
                { model: Category, attributes: ['name'] },
                { model: Supplier, attributes: ['name'] },
                { model: ProductImages, attributes: ['name'] }
            ]
        });
        if (!product) return res.redirect('/dashboard/404');
        res.render('view-product.ejs', { product: product.dataValues });
    } catch (err) {
        console.log(err);
        return res.redirect('/dashboard/500');
    }
};

exports.getUpdateProduct = async (req, res) => {
    try {
        let { id } = req.params;
        let product = await Product.findByPk(id, {
            include: [
                { model: Category, attributes: ['name'] },
                { model: Supplier, attributes: ['name'] },
                { model: ProductImages, attributes: ['name'] }
            ]
        });
        if (!product) return res.redirect('/dashboard/404');

        return res.render('update-product.ejs', {
            categories: await categoryList(),
            suppliers: await supplierList(),
            product: product.dataValues,
            message: ``,
            error_message: ''
        });
    } catch (err) {
        return res.redirect('/dashboard/500');
    }
};

exports.putUpdateProduct = async (req, res) => {
    try {
        const categories = await categoryList();
        const suppliers = await supplierList();

        let { id } = req.params;
        let product = await Product.findByPk(id, {
            include: [
                { model: Category, attributes: ['name'] },
                { model: Supplier, attributes: ['name'] },
                { model: ProductImages, attributes: ['name'] }
            ]
        });
        if (!product) return res.redirect('/dashboard/404');
        await productSchema.run(req);
        const validation = validationResult(req);
        if (validation.errors.length) {
            if (req.files) for (key in req.files) fs.unlink(req.files[key].path);
            return res.render('update-product.ejs', {
                categories,
                suppliers,
                product,
                message: '',
                error_message: validation.array().map(error => error.msg)
            });
        }

        await product.set(req.body);
        await product.save();

        if (req.body.removedImages) await deleteProductsImages(req.body.removedImages);
        if (req.files) await saveProductsImages(product, req.files);

        product.ProductImages = await product.getProductImages({
            attributes: ['name']
        });

        return res.render('update-product.ejs', {
            categories,
            suppliers,
            product,
            message: `${product.name} updated successfully :)`,
            error_message: ''
        });
    } catch (err) {
        return res.redirect('/dashboard/500');
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        let { id } = req.params;
        if (!id) return res.redirect('/dashboard/404');
        // if (id == req.session.uid) return res.redirect('/dashboard/403');
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