const { compare, hash, genSalt } = require('bcrypt');
const { User, Sequelize, sequelize } = require('../models');
const { sign, verify, JsonWebTokenError, TokenExpiredError } = require('jsonwebtoken');
// db.User
const { redisClient } = require('../utils/redis');

exports.signUp = async (req, res) => {
    try {
        const salt = await genSalt(10, 'b');
        const hashedPassword = await hash(req.body.password, salt);
        req.body.password = hashedPassword;
        let imageURL = '';
        // console.log(req.file);
        if (req.file) {
            req.body.image = req.file.path;
            imageURL = `http://localhost:5000/images/${req.file.filename}`;
        }
        let user = await User.create(req.body);
        // const token = sign({ id: user.id, role: user.role }, process.env.PEK, { algorithm: 'RS256', expiresIn: '2 days' });
        // res.cookie('access_token', token, {
        //     expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        //     httpOnly: true,
        //     secure: true,
        //     sameSite: 'strict',
        //     signed: true,
        //     overwrite: true
        // });
        return res.status(201).json({
            message: 'SignUp is success, but you have to wait for the admin approval :)',
            user,
            imageURL
        });
    } catch (err) {
        // try to check if err is instanceOf SequelizeValidation error ..
        if (err instanceof Sequelize.ValidationError) return res.status(400).json({
            message: 'Bad Params, error validation your information!'
        });
        else return res.status(500).json({ message: 'Internal Error, Please try again later!', err });
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
        if (!isValidPassword) return res.status(401).json({ message: 'Unauthorized, Incorrect Password! :(' });
        if (user.status == 'Pending') return res.status(403).json({
            message: "Forbidden, your account hasn't been approved by the admin yet! >_<",
        });
        if (user.status == 'Inactive') return res.status(403).json({
            message: "Forbidden, your account has been disabled by the admin! >_<",
        });
        const token = sign({ id: user.id, role: user.role }, process.env.PEK, { algorithm: 'RS256', expiresIn: '12h' });
        const refreshToken = sign({ id: user.id }, process.env.REFRESH_PEK, { algorithm: 'RS256', expiresIn: '7 days' });
        // res.cookie('refreshToken', refreshToken, {
        //     expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        //     httpOnly: true,
        //     secure: true,
        //     sameSite: 'strict',
        //     signed: true,
        //     overwrite: true
        // });
        return res.status(201).json({ message: 'SignIn Success :)', user, token, refreshToken });
    } catch (err) {
        return res.status(500).json({ message: 'Internal Error, Please try again later!', err });
    }
};

exports.refreshToken = async (req, res) => {
    // implement a separate token for the refresh and another to authenticate 
    try {
        let { refreshToken, id, exp } = req.tokenInfo;
        let newRefreshToken = sign({ id }, process.env.REFRESH_PEK, { algorithm: 'RS256', expiresIn: '7 days' });
        let { role } = await User.findByPk(id);
        console.log(role);
        const payload = role ? { id, role } : { id };
        let newToken = sign(payload, process.env.PEK, { algorithm: 'RS256', expiresIn: 10 });
        const tokenRemainingTime = parseInt((exp * 1000 - Date.now()) / 1000, 10);
        await redisClient.set(refreshToken, "blacklisted", 'EX', tokenRemainingTime);
        return res.status(201).json({ message: 'ok :)', newToken, newRefreshToken });
    } catch (err) {
        return res.status(500).json({ message: 'Internal Error, Please try again later!', err });
    }
};

exports.logout = async (req, res) => {
    try {
        const { token, exp } = req.tokenInfo;
        const tokenRemainingTime = parseInt((exp * 1000 - Date.now()) / 1000, 10);
        await redisClient.set(token, "blacklisted", 'EX', tokenRemainingTime);
        // res.clearCookie('refreshToken', {
        //     expires: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        //     httpOnly: true,
        //     secure: true,
        //     sameSite: 'strict',
        //     signed: true,
        //     overwrite: true
        // });
        return res.status(200).json({ message: 'Logged out successfully :)' });
    } catch (err) {
        if (err instanceof JsonWebTokenError) return res.status(400).json({ message: 'Bad Token >_<' });
        if (err instanceof TokenExpiredError) return res.status(401).json({
            message: 'Unauthorized, token expired, please reauthenticate! >_<'
        });
        else return res.status(500).json({ message: 'Internal Error, Please try again later!', err });
    }
};