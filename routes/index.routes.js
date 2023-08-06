const app = require('express').Router();

app.get('/test', (req, res) => {
    res.status(200).send('Works :)');
});

<<<<<<< HEAD
app.use('/auth', require('./auth.routes'));
app.use('/users', require('./user.routes'));

=======
>>>>>>> migration_associations
module.exports = app;