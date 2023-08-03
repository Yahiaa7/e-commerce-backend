const moment = require('moment');
const { User, Sequelize } = require('../models');
const { compare, genSalt, hash } = require('bcrypt');


exports.get403 = (req, res) => res.render('403.ejs', { title: '403', });

exports.get404 = (req, res) => res.render('404.ejs', { title: '404', });

exports.get500 = (req, res) => res.render('500.ejs', { title: '500', });

exports.getAdminLogin = (req, res) => {
    // req.session.isLoggedIn ?
    // res.redirect('/dashboard/') : res.render('login.ejs', { error_message: '' });
    if (req.session.isLoggedIn) res.redirect('/dashboard/');
    else {
        res.render('login.ejs', { title: 'Login', error_message: '' });
    }
};

exports.postAdminLogin = async (req, res) => {
    if (!req.body.username || !req.body.password) return res.render('login.ejs', {
        title:'Login', error_message: 'Please fill all fields! :('
    });
    let { username, password } = req.body;
    let user = await User.findOne({ where: { username } });
    if (!user) return res.render('login.ejs', { title:'Login', error_message: 'Not Found, No such user :(' });
    const isValidPassword = await compare(password, user.password);
    if (!isValidPassword) return res.render('login.ejs', { title:'Login', error_message: 'Unauthorized, Incorrect Password! :(' });
    if (!(user.role == 'Admin')) return res.render('login.ejs', { title:'Login', error_message: 'Unauthorized Access!' });

    req.session.uid = user.id;
    req.session.role = user.role;
    req.session.isLoggedIn = true;
    return res.redirect('/dashboard/');
};

// send admin data with the getHome
exports.getHome = (req, res) => res.render('index.ejs',{title:'Home'});

// send list of users paginated
exports.getUsers = async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const pageSize = parseInt(req.query.pageSize, 10) || 10;

    let users = await User.findAndCountAll({
        offset: (page - 1) * pageSize,
        limit: pageSize
    });

    return res.render('users.ejs', {
        title:'Users', 
        page,
        pageSize: users.rows.length,
        totalPages: Math.ceil(users.count / pageSize),
        users: users.rows
    });
};

// send add-user page
exports.getAddUser = (req, res) => res.render('add-user.ejs', { title:'Add User', title: 'Login', message: '', error_message: '' });

// add user to database
exports.postAddUser = async (req, res) => {
    try {
        const salt = await genSalt(10, 'b');
        const hashedPassword = await hash(req.body.password, salt);
        req.body.password = hashedPassword;
        if (req.file) req.body.image = req.file.path;
        if (req.body.birthday && req.body.birthday != '') req.body.birthday = new Date(req.body.birthday);
        else req.body.birthday = null;
        if (req.body.phone) req.body.phone = String(req.body.phone);
        let user = await User.create(req.body);
        return res.render('add-user.ejs', { title: 'Add User', message: `Success, new ${user.role} added successfully!`, error_message: '' });
    } catch (err) {
        if (err instanceof Sequelize.Error) return res.render('add-user.ejs', {
            title: 'Add User',
            message: '',
            error_message: 'Bad Params, error validating your information!'
        });
        else return res.redirect('/dashboard/500');
        // else return res.render('login.ejs', {
        //     title:'Login', error_message: "Internal Error, Could't process your request! >_<"
        // });
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
        res.render('view-user.ejs', { title:'View User', user: user.dataValues });
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
        return res.render('update-user.ejs', { title:'Update User', user: user.dataValues, message: `` });
    } catch (err) {
        return res.redirect('/dashboard/500');
    }
};

// update user data in the database
exports.putUpdateUser = async (req, res) => {
    try {
        let { id } = req.params;
        if (!id) return res.redirect('/dashboard/404');
        let user = await User.findByPk(id);
        if (!user) return res.redirect('/dashboard/404');
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
        return res.render('update-user.ejs', { title:'Update User', user: user.dataValues, message: `${user.role} updated successfully :)` });
    } catch (err) {
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