const { MonthlyExpenses, User, Sequelize } = require('../../models');

exports.getAllME = async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const pageSize = parseInt(req.query.pageSize, 10) || 10;

    let me = await MonthlyExpenses.findAndCountAll({
        offset: (page - 1) * pageSize,
        limit: pageSize
    });

    return res.render('monthly-expenses.ejs', {
        page,
        pageSize: me.rows.length,
        totalPages: Math.ceil(me.count / pageSize),
        me: me.rows
    });
};

exports.getAddME = (req, res) => {
    res.render('add-monthly-expenses.ejs', { message: '', error_message: '' })
};

exports.postAddME = async (req, res) => {
    try {
        let uId = req.session.uid;
        let user = await User.findByPk(uId);
        let me = await user.createMonthlyExpense(req.body);
        return res.render('add-monthly-expenses.ejs', {
            message: `Success, new Monthly expense ${me.name} added successfully!`,
            error_message: ''
        });
    } catch (err) {
        if (err instanceof Sequelize.Error) return res.render('add-monthly-expenses.ejs', {
            message: '',
            error_message: 'Bad Params, error validating your information!'
        });
        else return res.redirect('/dashboard/500');
    }
};

exports.getME = async (req, res) => {
    try {
        let { id } = req.params;
        // if (!id) return res.redirect('/dashboard/404');
        let me = await MonthlyExpenses.findByPk(id);
        if (!me) return res.redirect('/dashboard/404');
        res.render('view-monthly-expenses.ejs', { me });
    } catch (err) {
        return res.redirect('/dashboard/500');
    }
};

exports.getUpdateME = async (req, res) => {
    try {
        let { id } = req.params;
        // if (!id) return res.redirect('/dashboard/404');
        let me = await MonthlyExpenses.findByPk(id);
        if (!me) return res.redirect('/dashboard/404');
        return res.render('update-monthly-expenses.ejs', { me, message: ``, error_message: `` });
    } catch (err) {
        return res.redirect('/dashboard/500');
    }
};

exports.putUpdateME = async (req, res) => {
    try {
        let { id } = req.params;
        // if (!id) return res.redirect('/dashboard/404');
        let me = await MonthlyExpenses.findByPk(id);
        if (!me) return res.redirect('/dashboard/404');
        me.set(req.body);
        await me.save();
        return res.render('update-monthly-expenses.ejs', {
            me,
            message: `${me.name} updated successfully :)`,
            error_message: ``
        });
    } catch (err) {
        return res.redirect('/dashboard/500');
    }
};

exports.deleteME = async (req, res) => {
    try {
        let { id } = req.params;
        let me = await MonthlyExpenses.findByPk(id);
        if (!me) return res.redirect('/dashboard/404');
        await me.destroy();
        const referringPage = req.header('referer') || '/dashboard/';
        res.redirect(referringPage);
    } catch (err) {
        console.log(err);
        return res.redirect('/dashboard/500');
    }
};