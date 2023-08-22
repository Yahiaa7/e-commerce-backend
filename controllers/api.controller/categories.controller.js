const { Category, Sequelize } = require('../../models');
const { responseSuccess, responseFailed } = require('../../utils/responseReturn');

exports.getCategories = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const pageSize = parseInt(req.query.pageSize, 10) || 10;

        let categories = await Category.findAndCountAll({
            offset: (page - 1) * pageSize,
            limit: pageSize
        });

        return responseSuccess(
            res, 200,
            {
                page,
                pageSize: categories.rows.length,
                totalPages: Math.ceil(categories.count / pageSize),
                categories: categories.rows
            }
        );
    } catch (err) {
        if (err instanceof Sequelize.Error) return responseFailed(res, 400, {
            error_message: 'Bad Params, error validating your information!',
            error: err.message
        });
        else return responseFailed(res, 500, {
            error_message: "Internal Error, Could't process your request! >_<",
            error: err.message
        });
    }
};
