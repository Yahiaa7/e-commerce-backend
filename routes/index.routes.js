const app = require('express').Router();

app.get('/test', (req, res) => {
    res.status(200).send('Works :)');
});

module.exports = app;