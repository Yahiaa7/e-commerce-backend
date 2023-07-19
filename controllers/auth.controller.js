const { User } = require('../models');
const jwt = require('jsonwebtoken');

exports.signUp = async (req, res) => {
    try {
        let user = await User.create(req.body);
        const token = jwt.sign(user.id, process.env.AUTH_KEY, { expiresIn: '1 day' });
        return res.status(201).json({
            message: 'SignUp is success, but you have to wait for the admin approval :)',
            user,
            token
        });
    } catch (err) {
        return res.status(500).send('Internal Error, Please try again later!');
    }
};

exports.signIn = async (req, res) => {
    if (!req.body.username || !req.body.password) return res.status(400).json({
        message: 'Bad Request, insufficient params >_<'
    });
    let { username, password } = req.body;
    let user = await User.findOne({ where: { username } });
    if (!user) return res.status(404).json({ message: 'Not Found, No such user :(' });
    // to be continued ..
};