const authMiddleware = require('./auth.middleware');
const { adminController: { getAdminLogin } } = require('../controllers');

const isLoggedIn = (req, res, next) => {
    if(!req.session?.isLoggedIn) return res.redirect('/dashboard/adminLogin');
    else return next();
};


module.exports = {
    isLoggedIn,
    authMiddleware
};