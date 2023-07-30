module.exports.responseSuccess = (res, code, payload, message) => {
    return res.status(code).json({
        status: 'Success',
        code,
        message,
        payload,
        error: {}
    });
};

module.exports.responseFailed = (res, code, error) => {
    return res.status(code).json({
        status: 'Failed',
        code,
        message: '',
        payload: {},
        error
    });
};