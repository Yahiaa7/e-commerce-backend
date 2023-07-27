const app = require('express').Router();

app.get('/test', (req, res) => {
    res.status(200).send('Works :)');
});

app.use('/auth', require('./auth.routes'));
app.use('/users', require('./user.routes'));

module.exports = app;