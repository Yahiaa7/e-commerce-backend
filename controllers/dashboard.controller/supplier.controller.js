const { Supplier } = require('../../models');
const moment = require('moment');
const { supplierSchema } = require('../../utils/schemas');
const { validationResult } = require('express-validator');
const fs = require('fs/promises');

// send list of suppliers paginated
exports.getSuppliers = async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const pageSize = parseInt(req.query.pageSize, 10) || 10;

    let suppliers = await Supplier.findAndCountAll({
        offset: (page - 1) * pageSize,
        limit: pageSize
    });

    return res.render('suppliers.ejs', {
        page,
        pageSize: suppliers.rows.length,
        totalPages: Math.ceil(suppliers.count / pageSize),
        suppliers: suppliers.rows
    });
};

// send add-supplier page
exports.getAddSupplier = (req, res) => res.render('add-supplier.ejs', { message: '', error_message: '' });

// add supplier to database
exports.postAddSupplier = async (req, res) => {
    try {
        await supplierSchema.run(req);
        const validation = validationResult(req);
        if (validation.errors.length) {
            if (req.file) fs.unlink(req.file.path);
            return res.render('add-supplier.ejs', { message: '', error_message: validation.array().map(error => error.msg) });
        }
        if (req.file) req.body.image = req.file.path;
        // if (req.body.birthday && req.body.birthday != '') req.body.birthday = new Date(req.body.birthday);
        // else req.body.birthday = null;
        if (req.body.phone) req.body.phone = String(req.body.phone);
        await Supplier.create(req.body);
        return res.render('add-supplier.ejs', {
            message: `Success, new supplier added successfully!`,
            error_message: ''
        });
    } catch (err) {
        if (err instanceof Sequelize.Error) return res.render('add-supplier.ejs', {
            message: '',
            error_message: 'Bad Params, error validating your information!'
        });
        else return res.redirect('/dashboard/500');
    }
};

// send specific supplier data
exports.getViewSupplier = async (req, res) => {
    try {
        let { id } = req.params;
        if (!id) return res.redirect('/dashboard/404');
        let supplier = await Supplier.findByPk(id);
        if (!supplier) return res.redirect('/dashboard/404');
        if (supplier.dataValues.birthday) supplier.dataValues.birthday = moment(supplier.dataValues.birthday).format('YYYY-MM-DD').split(" ");
        if (supplier.dataValues.image) supplier.dataValues.imageUrl = `http://localhost:5000/images/${supplier.image.split('\\')[3]}`;
        res.render('view-supplier.ejs', { supplier: supplier.dataValues });
    } catch (err) {
        return res.redirect('/dashboard/500');
    }
};

// send specific supplier data with the update page
exports.getUpdateSupplier = async (req, res) => {
    try {
        let { id } = req.params;
        if (!id) return res.redirect('/dashboard/404');
        let supplier = await Supplier.findByPk(id);
        if (!supplier) return res.redirect('/dashboard/404');
        if (supplier.dataValues.birthday) supplier.dataValues.birthday = moment(supplier.dataValues.birthday).format('YYYY-MM-DD').split(" ");
        if (supplier.dataValues.image) supplier.dataValues.imageUrl = `http://localhost:5000/images/${supplier.image.split('\\')[3]}`;
        return res.render('update-supplier.ejs', { supplier: supplier.dataValues, message: `` });
    } catch (err) {
        return res.redirect('/dashboard/500');
    }
};

// update supplier data in the database
exports.putUpdateSupplier = async (req, res) => {
    try {
        let { id } = req.params;
        if (!id) return res.redirect('/dashboard/404');
        let supplier = await Supplier.findByPk(id);
        if (!supplier) return res.redirect('/dashboard/404');
        await supplierSchema.run(req);
        const validation = validationResult(req);
        if (validation.errors.length) {
            if (req.file) fs.unlink(req.file.path);
            return res.render('update-supplier.ejs', { supplier: supplier.dataValues, message: '', error_message: validation.array().map(error => error.msg) });
        }
        if (req.file) {
            req.body.image = req.file.path;
        };
        if (req.body.birthday && req.body.birthday != '') req.body.birthday = new Date(req.body.birthday);
        else req.body.birthday = null;
        supplier.set(req.body);
        await supplier.save();
        if (supplier.dataValues.birthday) supplier.dataValues.birthday = moment(supplier.dataValues.birthday).format('YYYY-MM-DD').split(" ");
        if (supplier.dataValues.image) supplier.dataValues.imageUrl = `http://localhost:5000/images/${supplier.image.split('\\')[3]}`;
        return res.render('update-supplier.ejs', { supplier: supplier.dataValues, message: `supplier updated successfully :)`, error_message: '' });
    } catch (err) {
        return res.redirect('/dashboard/500');
    }
};

exports.deleteSupplier = async (req, res) => {
    try {
        let { id } = req.params;
        if (!id) return res.redirect('/dashboard/404');
        let supplier = await Supplier.findByPk(id);
        if (!supplier) return res.redirect('/dashboard/404');
        await supplier.destroy();
        const referringPage = req.header('referer') || '/dashboard/';
        res.redirect(referringPage);
    } catch (err) {
        console.log(err);
        return res.redirect('/dashboard/500');
    }
}