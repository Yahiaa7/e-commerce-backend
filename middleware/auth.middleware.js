const { User } = require('../models');

exports.checkDuplicateUser = async (req, res, next) => {
    try {
        let { username } = req.body;
        if (!username) return res.status(400).json({ message: 'Bad Request, insufficient params >_<' });
        let user = await User.findOne({ where: { username } });
        if (user) return res.status(409).json({ message: 'Conflict, a user with the same username already exists :(' });
        return next();
    } catch (err) {
        return res.status(500).json({ message: 'Internal Error, Please try again later!' });
    }
};
