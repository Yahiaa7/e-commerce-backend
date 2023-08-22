exports.isLoggedIn = (req, res, next) => {
    if (!req.session?.isLoggedIn) return res.redirect('/dashboard/auth/login');
    else return next();
};

// exports.isAdmin = async (req, res, next) => {
//     console.log('IsAdmin', req.session);
//     if (req.session.role == 'Admin') return next();
//     else return res.redirect('/dashboard/403');
// };

// exports.isStoreManager = async (req, res, next) => {
//     console.log('IsStoreManager', req.session);
//     if (req.session.role == 'Store Manager') return next();
//     else return res.redirect('/dashboard/403');
// };

// exports.isAdvertisingManager = async (req, res, next) => {
//     if (req.session.role == 'Advertising Manager') return next();
//     else return res.redirect('/dashboard/403');
// };

// exports.isUser = async (req, res, next) => {
//     if (req.session.role == 'User') return next();
//     else return res.redirect('/dashboard/403');
// };

exports.isAdmin = (role) => role === 'Admin';

exports.isStoreManager = (role) => role === 'Store Manager';

exports.isAdvertisingManager = (role) => role === 'Advertising Manager'

exports.isUser = (role) => role === 'User';

exports.hasAccess = (...allowedRoles) => (req, res, next) => {
    const isAllowed = allowedRoles[0].some(roleF => roleF(req.session.role));
    isAllowed ? next() : res.redirect('/dashboard/403');
};