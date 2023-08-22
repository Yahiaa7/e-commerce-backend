const app = require('express').Router();
const { dashboardController: { monthlyExpensesController } } = require('../../controllers');

// Monthly Expenses CRUD routes

app.get('/', monthlyExpensesController.getAllME);

app.get('/add', monthlyExpensesController.getAddME);

app.post('/add', monthlyExpensesController.postAddME);

app.get('/:id', monthlyExpensesController.getME);

app.get('/update/:id', monthlyExpensesController.getUpdateME);

app.post('/update/:id', monthlyExpensesController.putUpdateME);

app.get('/delete/:id', monthlyExpensesController.deleteME);

module.exports = app;