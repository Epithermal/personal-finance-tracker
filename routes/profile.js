const express = require('express');
const User = require('../models/User');
const router = express.Router();

router.get('/profile', (req, res) => {
  res.render('profile', { user: req.user });
});

router.post('/profile', async (req, res) => {
  const { username, email, password } = req.body;
  const user = await User.findById(req.user._id);
  user.username = username;
  user.email = email;
  if (password) {
    user.password = password;
  }
  await user.save();
  res.redirect('/profile');
});

module.exports = router;
