const { User, Sequelize } = require('../../models');
const { genSalt, hash } = require('bcrypt');
const { responseSuccess, responseFailed } = require('../../utils/responseReturn');
const moment = require('moment');
const { userSchema, userUpSchema } = require("../../utils/schemas");
const fs = require('fs/promises');
const { validationResult } = require('express-validator');


// send list of users paginated
exports.getUsers = async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const pageSize = parseInt(req.query.pageSize, 10) || 10;

    let users = await User.findAndCountAll({
        offset: (page - 1) * pageSize,
        limit: pageSize
    });

    return res.render('users.ejs', {
        page,
        pageSize: users.rows.length,
        totalPages: Math.ceil(users.count / pageSize),
        users: users.rows
    });
};

// send add-user page
exports.getAddUser = (req, res) => res.render('add-user.ejs', { message: '', error_message: '' });

// add user to database
exports.postAddUser = async (req, res) => {
    try {
        await userSchema.run(req);
        const validation = validationResult(req);
        if (validation.errors.length) {
            if (req.file) fs.unlink(req.file.path);
            return res.render('add-user.ejs', { message: '', error_message: validation.array().map(error=>error.msg) });
        }
        const salt = await genSalt(10, 'b');
        const hashedPassword = await hash(req.body.password, salt);
        req.body.password = hashedPassword;
        if (req.file) req.body.image = req.file.path;
        if (req.body.birthday && req.body.birthday != '') req.body.birthday = new Date(req.body.birthday);
        else req.body.birthday = null;
        if (req.body.phone) req.body.phone = String(req.body.phone);
        let user = await User.create(req.body);
        return res.render('add-user.ejs', { message: `Success, new ${user.role} added successfully!`, error_message: '' });
    } catch (err) {
        if (err instanceof Sequelize.Error) return res.render('add-user.ejs', {
            message: '',
            error_message: 'Bad Params, error validating your information!'
        });
        else return res.redirect('/dashboard/500');
    }
};

// send specific user data
exports.getViewUser = async (req, res) => {
    try {
        let { id } = req.params;
        if (!id) return res.redirect('/dashboard/404');
        let user = await User.findByPk(id);
        if (!user) return res.redirect('/dashboard/404');
        if (user.dataValues.birthday) user.dataValues.birthday = moment(user.dataValues.birthday).format('YYYY-MM-DD').split(" ");
        if (user.dataValues.image) user.dataValues.imageUrl = `http://localhost:5000/images/${user.image.split('\\')[3]}`;
        res.render('view-user.ejs', { user: user.dataValues });
    } catch (err) {
        return res.redirect('/dashboard/500');
    }
};

// send specific user data with the update page
exports.getUpdateUser = async (req, res) => {
    try {
        let { id } = req.params;
        if (!id) return res.redirect('/dashboard/404');
        let user = await User.findByPk(id);
        if (!user) return res.redirect('/dashboard/404');
        if (user.dataValues.birthday) user.dataValues.birthday = moment(user.dataValues.birthday).format('YYYY-MM-DD').split(" ");
        if (user.dataValues.image) user.dataValues.imageUrl = `http://localhost:5000/images/${user.image.split('\\')[3]}`;
        return res.render('update-user.ejs', { user: user.dataValues, message: ``, error_message: '' });
    } catch (err) {
        return res.redirect('/dashboard/500');
    }
};

// update user data in the database
exports.putUpdateUser = async (req, res) => {
    try {
        let { id } = req.params;
        let user = await User.findByPk(id);
        if (!user) return res.redirect('/dashboard/404');

        await userUpSchema.run(req);
        const validation = validationResult(req);
        if (validation.errors.length) {
            if (req.file) fs.unlink(req.file.path);
            return res.render('update-user.ejs', {
                user: user.dataValues,
                message: '',
                error_message: validation.array().map(error=>error.msg)
            });
        }

        if (req.file) {
            req.body.image = req.file.path;
        };
        const salt = await genSalt(10, 'b');
        if (req.body.password) req.body.password = await hash(req.body.password, salt);
        if (req.body.birthday && req.body.birthday != '') req.body.birthday = new Date(req.body.birthday);
        else req.body.birthday = null;
        user.set(req.body);
        await user.save();
        if (user.dataValues.birthday) user.dataValues.birthday = moment(user.dataValues.birthday).format('YYYY-MM-DD').split(" ");
        if (user.dataValues.image) user.dataValues.imageUrl = `http://localhost:5000/images/${user.image.split('\\')[3]}`;
        return res.render('update-user.ejs', { user: user.dataValues, message: `${user.role} updated successfully :)`, error_message: '' });
    } catch (err) {
        return res.redirect('/dashboard/500');
    }
};

// update user status in the database
exports.setStatus = async (req, res) => {
    try {
        let { id } = req.params;
        let { status } = req.body;
        if (!id || !status) return responseFailed(res, 400, { message: 'Insufficient params!' })
        let user = await User.findByPk(id);
        if (!user) return responseFailed(res, 404, { message: 'No such user!' });
        user.set({ status });
        await user.save();
        return responseSuccess(res, 200, {}, `${user.name} status updated successfully!`);
    } catch (err) {
        console.log(err);
        return res.redirect('/dashboard/500');
    }
};

exports.deleteUser = async (req, res) => {
    try {
        let { id } = req.params;
        if (!id) return res.redirect('/dashboard/404');
        if (id == req.session.uid) return res.redirect('/dashboard/403');
        let user = await User.findByPk(id);
        if (!user) return res.redirect('/dashboard/404');
        let role = user.role;
        await user.destroy();
        const referringPage = req.header('referer') || '/dashboard/';
        res.redirect(referringPage);
    } catch (err) {
        console.log(err);
        return res.redirect('/dashboard/500');
    }
}