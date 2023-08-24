const { User, Invoice, InvoiceItem, Sequelize, Op } = require('../../models');
const { responseSuccess, responseFailed } = require("../../utils/responseReturn");

exports.getAllInvoices = async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const pageSize = parseInt(req.query.pageSize, 10) || 10;

    const user = await User.findByPk(req.tokenInfo.id);
    // console.log(Object.keys(user.__proto__));
    let count = await user.countInvoices();
    let invoices = await user.getInvoices({
        offset: (page - 1) * pageSize,
        limit: pageSize
    });

    return res.status(200).json({
        page,
        pageSize: invoices.length,
        totalPages: Math.ceil(count / pageSize),
        users: invoices
    });
};

exports.getInvoice = async (req, res) => {
    try {
        const { invoiceId } = req.params;
    
        const invoice = await Invoice.findByPk(invoiceId, { include: { model: InvoiceItem, required: true } });
        if (!invoice) return responseFailed(res, 404, { error_message: 'NOt FOUND!' })
        return res.status(200).json({ message: 'Invoice found!', invoice });
    } catch (err) {
        
    }
}
