const moment = require('moment');
const { genSalt, hash } = require('bcrypt');
const { User, Sequelize, sequelize } = require('../../models');
const { responseSuccess, responseFailed } = require('../../utils/responseReturn');

exports.getAllUsers = async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const pageSize = parseInt(req.query.pageSize, 10) || 10;

    let users = await User.findAndCountAll({
        offset: (page - 1) * pageSize,
        limit: pageSize
    });

    return res.status(200).json({
        page,
        pageSize: users.rows.length,
        totalPages: Math.ceil(users.count / pageSize),
        users: users.rows
    });
};

exports.getUser = async (req, res) => {
    try {
        let { id } = req.params;
        if (!id) return res.status(400).send({ message: 'Invalid Request, not enough parameters!' });
        let user = await User.findByPk(id, {include:Product});
        if (!user) return res.status(404).json({ message: 'Not Found >_<' });
        return res.status(200).json({ message: 'ok :)', user });
    } catch (err) {
        return res.status(500).json({ message: "Could't process your request! >_<", err: err.message });
    }
}

exports.updateUser = async (req, res) => {
    try {
        let { id } = req.params;
        if (!id) return res.status(400).send({ message: 'Invalid Request, not enough parameters!' });
        let user = await User.findByPk(id);
        if (!user) return res.status(404).json({ message: 'Not Found >_<' });
        let imageURL = '';
        if (req.file) {
            req.body.image = req.file.path;
            imageURL = `http://localhost:5000/images/${req.file.filename}`;
        };
        const salt = await genSalt(10, 'b');
        if (req.body.password) req.body.password = await hash(req.body.password, salt);
        if (req.body.birthday) req.body.birthday = moment(new Date(req.body.birthday)).format('DD/MM/YYYY');
        user.set(req.body);
        await user.save();
        return res.status(202).json({
            message: 'User updated successfully :)',
            user,
            imageURL: imageURL ?? user.imageURL
        });
    } catch (err) {
        // if (err instanceof Sequelize.ValidationError) console.log(err);
        return res.status(500).json({ message: "Couldn't process your request! >_<", err: err.message });
    }
}

exports.deleteUser = async (req, res) => {
    try {
        let { id } = req.params;
        if (!id) return res.status(400).send({ message: 'Invalid Request, not enough parameters!' });
        if (id == req.tokenInfo.id) return res.status(403).json({ message: 'forbidden >_<' });
        let user = await User.findByPk(id);
        if (!user) return res.status(404).json({ message: 'Not Found >_<' });
        await user.destroy();
        return res.status(200).json({ message: 'User deleted successfully :)' });
    } catch (err) {
        return res.status(500).json({ message: "Couldn't process your request! >_<", error: err.message });
    }
}

// status
// code
// message
// payload
// error
