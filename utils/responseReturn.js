module.exports.responseSuccess = (res, code, payload, message) =>
res.status(code).json({
    status: 'Success',
    code,
    message: message ?? '',
    payload,
    error: {}
});


module.exports.responseFailed = (res, code, error) =>
    res.status(code).json({
        status: 'Failed',
        code,
        message: '',
        payload: {},
        error
    });