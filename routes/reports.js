const express = require('express');
const Transaction = require('../models/Transaction');
const { ensureAuthenticated } = require('../middlewares/auth');
const router = express.Router();

router.get('/reports', ensureAuthenticated, async (req, res) => {
  const transactions = await Transaction.find({ user: req.user._id }).populate('category');
  console.log(transactions);
  res.render('reports', { transactions });
});

module.exports = router;
