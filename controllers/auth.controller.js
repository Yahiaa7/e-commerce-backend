const { compare, hash, genSalt } = require('bcrypt');
const { User } = require('../models');
const jwt = require('jsonwebtoken');

exports.signUp = async (req, res) => {
    try {
        const salt = await genSalt(10, 'b');
        const hashedPassword = await hash(req.body.password, salt);
        req.body.password = hashedPassword;
        let user = await User.create(req.body);
        const token = jwt.sign(user.id, process.env.PEK, { algorithm: 'RS256', expiresIn: '1 day' });

        return res.status(201).json({
            message: 'SignUp is success, but you have to wait for the admin approval :)',
            user,
            token
        });
    } catch (err) {
        // try to check if err is instanceOf SequelizeValidation error ..
        return res.status(500).send('Internal Error, Please try again later!');
    }
};

exports.signIn = async (req, res) => {
    try {
        if (!req.body.username || !req.body.password) return res.status(400).json({
            message: 'Bad Request, insufficient params >_<'
        });
        let { username, password } = req.body;
        let user = await User.findOne({ where: { username } });
        if (!user) return res.status(404).json({ message: 'Not Found, No such user :(' });
        const isValidPassword = await compare(password, user.password);
        if (!isValidPassword) return res.status(401).json('Unauthorized, Incorrect Password! :(');
        if (user.status == 'Pending') return res.status(403).json({
            message: "Forbidden, your account hasn't been approved by the admin yet! >_<",
        });
        if (user.status == 'Inactive') return res.status(403).json({
            message: "Forbidden, your account has been disabled by the admin! >_<",
        });
        const token = jwt.sign(user.id, process.env.PEK, { algorithm: 'RS256', expiresIn: '1 day' });
        res.cookies('access_token', token, {
            expires: new Date(Date.now + 24 * 60 * 60 * 1000)
        });
        return res.status(201).json({ message: 'SignIn Success :)', user, token });
    } catch (err) {
        // try to check if err is instanceOf SequelizeValidation error ..
        return res.status(500).send('Internal Error, Please try again later!');
    }
};