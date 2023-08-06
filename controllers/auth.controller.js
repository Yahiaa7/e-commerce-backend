const moment = require('moment');
const { compare, hash, genSalt } = require('bcrypt');
const { User, Sequelize, sequelize } = require('../models');
const { sign, verify, JsonWebTokenError, TokenExpiredError } = require('jsonwebtoken');
// db.User
const { redisClient } = require('../utils/redis');
const { responseSuccess, responseFailed } = require('../utils/responseReturn');

exports.signUp = async (req, res) => {
    try {
        const salt = await genSalt(10, 'b');
        const hashedPassword = await hash(req.body.password, salt);
        req.body.password = hashedPassword;
        let imageURL = '';
        if (req.file) {
            req.body.image = req.file.path;
            imageURL = `http://localhost:5000/images/${req.file.filename}`;
        }
        if (req.body.birthday) req.body.birthday = moment(new Date(req.body.birthday)).format('DD/MM/YYYY');
        let user = await User.create(req.body);
        const payload = { user }
        if (imageURL) payload.imageURL = imageURL;
        responseSuccess(res, 201, payload, 'SignUp is success, but you have to wait for the admin approval :)');
    } catch (err) {
        // try to check if err is instanceOf SequelizeValidation error ..
        if (err instanceof Sequelize.ValidationError) responseFailed(res, 400, {
            error_message: 'Bad Params, error validating your information!',
            error: err.message
        });
        else responseFailed(res, 500, {
            error_message: "Internal Error, Could't process your request! >_<",
            error: err.message
        });
    }
};

exports.signIn = async (req, res) => {
    try {
        // if (!req.body.username || !req.body.password) return res.status(400).json({
        //     message: 'Bad Request, insufficient params >_<'
        // });
        if (!req.body.username || !req.body.password) responseFailed(res, 400, {
            error_message: 'Bad Request, insufficient params >_<'
        });
        let { username, password } = req.body;
        let user = await User.findOne({ where: { username } });
        // if (!user) return res.status(404).json({ message: 'Not Found, No such user :(' });
        if (!user) responseFailed(res, 404, { error_message: 'Not Found, No such user :(' });
        const isValidPassword = await compare(password, user.password);
        // if (!isValidPassword) return res.status(401).json({ message: 'Unauthorized, Incorrect Password! :(' });
        if (!isValidPassword) responseFailed(res, 401, { error_message: 'Unauthorized, Incorrect Password! :(' });
        // if (user.status == 'Pending') return res.status(403).json({
        //     message: "Forbidden, your account hasn't been approved by the admin yet! >_<",
        // });
        // if (user.status == 'Inactive') return res.status(403).json({
        //     message: "Forbidden, your account has been disabled by the admin! >_<",
        // });
        if (user.status == 'Pending') responseFailed(res, 403, {
            error_message: "Forbidden, your account hasn't been approved by the admin yet! >_<",
            error: err.message
        });
        if (user.status == 'Inactive') responseFailed(res, 403, {
            error_message: "Forbidden, your account has been disabled by the admin! >_<",
            error: err.message
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
        // return res.status(201).json({ message: 'SignIn Success :)', user, token, refreshToken });
        responseSuccess(res, 201, { user, token, refreshToken }, 'SignIn Success :)');
    } catch (err) {
        responseFailed(res, 500, {
            error_message: "Internal Error, Could't process your request! >_<",
            error: err.message
        });
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
        // return res.status(201).json({ message: 'ok :)', newToken, newRefreshToken });
        responseSuccess(res, 201, { newToken, newRefreshToken }, 'Token refreshed successfully! :)');
    } catch (err) {
        responseFailed(res, 500, {
            error_message: "Internal Error, Could't process your request! >_<",
            error: err.message
        });
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
        // return res.status(200).json({ message: 'Logged out successfully :)' });
        responseSuccess(res, 200, {}, 'Logged out successfully :)');
    } catch (err) {
        responseFailed(res, 500, {
            error_message: "Internal Error, Could't process your request! >_<",
            error: err.message
        });
    }
};