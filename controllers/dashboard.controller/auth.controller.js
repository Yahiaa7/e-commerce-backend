
const { authMiddleware: { isAdmin, isAdvertisingManager, isStoreManager } } = require('../../middleware/dashboard');
const { User } = require('../../models');
const { compare } = require('bcrypt');

exports.getLogin = (req, res) => {
    if (req.session.isLoggedIn) res.redirect('/dashboard/');
    else res.render('login.ejs', { error_message: '' });
};

exports.postLogin = async (req, res) => {
    if (!req.body.username || !req.body.password) return res.render('login.ejs', {
        error_message: 'Please fill all fields! :('
    });
    let { username, password } = req.body;
    let user = await User.findOne({ where: { username } });
    if (!user) return res.render('login.ejs', { error_message: 'Not Found, No such user :(' });
    const isValidPassword = await compare(password, user.password);
    if (!isValidPassword) return res.render('login.ejs', { error_message: 'Unauthorized, Incorrect Password! :(' });
    if (!(
        isAdmin(user.role) ||
        isStoreManager(user.role) ||
        isAdvertisingManager(user.role)
    )) return res.render('login.ejs', { error_message: 'Unauthorized Access!' });

    req.session.uid = user.id;
    req.session.role = user.role;
    req.session.isLoggedIn = true;
    return res.redirect('/dashboard/');
};

exports.logout = (req, res) => {
    req.session.destroy(err => err ?? console.log('Error destroying session!', err));
    res.redirect('/dashboard/auth/login');
}