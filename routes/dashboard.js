const express = require('express');
const Transaction = require('../models/Transaction');
const Category = require('../models/Category');
const { ensureAuthenticated } = require('../middlewares/auth');
const router = express.Router();

router.get('/dashboard', ensureAuthenticated, async (req, res) => {
  const transactions = await Transaction.find({ user: req.user._id }).populate('category');
  const categories = await Category.find({ user: req.user._id });
  res.render('dashboard', { transactions, categories });
});

router.post('/transaction', ensureAuthenticated, async (req, res) => {
  const { type, category, amount, recurring, recurringInterval } = req.body;
  const isRecurring = recurring === 'on';
  const transaction = new Transaction({
    user: req.user._id,
    type,
    category,
    amount,
    recurring: isRecurring,
    recurringInterval: isRecurring ? recurringInterval : null,
  });
  await transaction.save();
  req.io.emit('newTransaction', transaction);
  res.redirect('/dashboard');
});

module.exports = router;
