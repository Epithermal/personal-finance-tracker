const express = require('express');
const Category = require('../models/Category');
const router = express.Router();

router.get('/categories', async (req, res) => {
  const categories = await Category.find({ user: req.user._id });
  res.render('categories', { categories });
});

router.post('/category', async (req, res) => {
  const { name } = req.body;
  const category = new Category({ name, user: req.user._id });
  await category.save();
  res.redirect('/categories');
});

module.exports = router;
