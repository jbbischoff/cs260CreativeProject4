const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

const mongoose = require('mongoose');


const expenseSchema = new mongoose.Schema({
  date: String,
  amount: Number,
  category: String,
  description: String,
  other: String
});
const Expense = mongoose.model('Expense', expenseSchema);

const incomeSchema = new mongoose.Schema({
  date: String,
  amount: Number,
  description: String,
  other: String
});
const Income = mongoose.model('Income', incomeSchema);


app.get('/api/expense', async(req, res) => {
  console.log("Get expenses request");
  try {
    let expenses = await Expense.find();
    res.send(expenses);
  }
  catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.post('/api/expense', async(req, res) => {
  console.log("Post expense request");
  const expense = new Expense({
    date: req.body.date,
    amount: req.body.amount,
    category: req.body.category,
    description: req.body.description,
    other: req.body.other
  });
  try {
    await expense.save();
    res.send(expense);
  }
  catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.put('/api/expense/:id', async(req, res) => {
  console.log("Put expense request");
  try {
    let expense = await Expense.findOne({
      _id: req.params.id
    });
    expense.date = req.body.date;
    expense.amount = req.body.amount;
    expense.category = req.body.category;
    expense.description = req.body.description;
    expense.other = req.body.other;
    await expense.save();
    res.sendStatus(200);
  }
  catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.delete('/api/expense/:id', async (req, res) => {
  console.log("Delete expense request");
  try {
    await Expense.deleteOne({
      _id: req.params.id
    });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.get('/api/income', async(req, res) => {
  console.log("Get income request");
  try {
    let income = await Income.find();
    res.send(income);
  }
  catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.post('/api/income', async(req, res) => {
  console.log("Post income request");
  const income = new Income({
    date: req.body.date,
    amount: req.body.amount,
    category: req.body.category,
    description: req.body.description,
    other: req.body.other
  });
  try {
    await income.save();
    res.send(income);
  }
  catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.put('/api/income/:id', async(req, res) => {
  console.log("Put income request");
  try {
    let income = await Income.findOne({
      _id: req.params.id
    });
    income.date = req.body.date;
    income.amount = req.body.amount;
    income.description = req.body.description;
    income.other = req.body.other;
    await income.save();
    res.sendStatus(200);
  }
  catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.delete('/api/income/:id', async (req, res) => {
  console.log("Delete income request");
  try {
    await Income.deleteOne({
      _id: req.params.id
    });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});



mongoose.connect('mongodb://localhost:27017/finance', {
  useNewUrlParser: true
});

app.listen(3000, () => console.log('Server listening on port 3000!'));
