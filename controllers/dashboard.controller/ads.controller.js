const { Advertisement, Product, Sequelize } = require('../../models');

exports.getAllAds = async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const pageSize = parseInt(req.query.pageSize, 10) || 10;

    let ads = await Advertisement.findAndCountAll({
        offset: (page - 1) * pageSize,
        limit: pageSize,
        include: {
            model: Product,
            attributes: ['name']
        }
    });
    return res.render('ads.ejs', {
        page,
        pageSize: ads.rows.length,
        totalPages: Math.ceil(ads.count / pageSize),
        ads: ads.rows
    });
};

const productList = async () => {
    const products = await Product.findAll({ attributes: ['id', 'name', 'price'] });
    return products.map(product => product.toJSON());
};

exports.getAddAds = async (req, res) => {
    res.render('add-ads.ejs', { products: await productList(), message: '', error_message: '' })
};

exports.postAddAds = async (req, res) => {
    const products = await productList();
    try {
        let { product_id } = req.body;
        const product = await Product.findByPk(product_id);
        // Do this in validation
        // if (!product) return res.render('add-ads.ejs', {
        //     products,
        //     message: '',
        //     error_message: 'Invalid product!'
        // });

        await product.createAdvertisement(req.body);
        return res.render('add-ads.ejs', {
            products,
            message: `Success, new Advertisement added successfully!`,
            error_message: ''
        });
    } catch (err) {
        console.log(err);
        if (err instanceof Sequelize.Error) return res.render('add-ads.ejs', {
            products,
            message: '',
            error_message: 'Bad Params, error validating your information!'
        });
        else return res.redirect('/dashboard/500');
    }
};

exports.getAds = async (req, res) => {
    try {
        let { id } = req.params;
        if (!id) return res.redirect('/dashboard/404');
        let ads = await Advertisement.findByPk(id, {
            include: { model: Product, attributes: ['name', 'price'] }
        });
        if (!ads) return res.redirect('/dashboard/404');
        console.log(ads);
        res.render('view-ads.ejs', { ads });
    } catch (err) {
        return res.redirect('/dashboard/500');
    }
};

exports.getUpdateAds = async (req, res) => {
    try {
        let { id } = req.params;
        if (!id) return res.redirect('/dashboard/404');
        let ads = await Advertisement.findByPk(id, {
            include: {
                model: Product,
                attributes: ['id', 'name', 'price']
            }
        });
        if (!ads) return res.redirect('/dashboard/404');
        return res.render('update-ads.ejs', {
            products: await productList(),
            ads,
            message: ``,
            error_message: ''
        });
    } catch (err) {
        return res.redirect('/dashboard/500');
    }
};

exports.putUpdateAds = async (req, res) => {
    try {
        let { id } = req.params;
        if (!id) return res.redirect('/dashboard/404');
        let ads = await Advertisement.findByPk(id, {
            include: {
                model: Product,
                attributes: ['id', 'name', 'price']
            }
        });
        if (!ads) return res.redirect('/dashboard/404');
        ads.set(req.body);
        await ads.save();
        return res.render('update-ads.ejs', {
            products: await productList(),
            ads,
            message: `Advertisement updated successfully :)`,
            error_message: ''
        });
    } catch (err) {
        return res.redirect('/dashboard/500');
    }
};

exports.deleteAds = async (req, res) => {
    try {
        let { id } = req.params;
        if (!id) return res.redirect('/dashboard/404');
        let ads = await Advertisement.findByPk(id);
        if (!ads) return res.redirect('/dashboard/404');
        await ads.destroy();
        const referringPage = req.header('referer') || '/dashboard/';
        res.redirect(referringPage);
    } catch (err) {
        console.log(err);
        return res.redirect('/dashboard/500');
    }
};