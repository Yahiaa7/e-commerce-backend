const { User } = require('../models');
const { compare } = require('bcrypt');
const { sign } = require('jsonwebtoken');


exports.getAdminLogin = (req, res) => {
    res.render('login.ejs', { error_message: '' });
};

exports.postAdminLogin = async (req, res) => {
    if (!req.body.username || !req.body.password) return res.render('login.ejs', {
        error_message: 'Bad Request, insufficient params >_<'
    });
    let { username, password } = req.body;
    let user = await User.findOne({ where: { username } });
    if (!user) return res.render('login.ejs', { error_message: 'Not Found, No such user :(' });
    const isValidPassword = await compare(password, user.password);
    if (!isValidPassword) return res.render('login.ejs', { error_message: 'Unauthorized, Incorrect Password! :(' });
    if (!(user.role == 'Admin')) return res.render('login.ejs', { error_message: 'Unauthorized Access!' });

    // const token = sign({ id: user.id, role: user.role }, process.env.PEK, { algorithm: 'RS256', expiresIn: '12h' });
    // const refreshToken = sign({ id: user.id }, process.env.REFRESH_PEK, { algorithm: 'RS256', expiresIn: '7 days' });

    res.redirect('/dashboard/');
};