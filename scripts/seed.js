const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker');
const User = require('../models/User');
const Category = require('../models/Category');
const Transaction = require('../models/Transaction');

// MongoDB connection
mongoose.connect('mongodb://localhost/financial-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Connected to MongoDB");
}).catch((err) => {
  console.error("Error connecting to MongoDB: ", err);
});

const seedDatabase = async () => {
  // Clear existing data
  await User.deleteMany({});
  await Category.deleteMany({});
  await Transaction.deleteMany({});

  // Create sample users
  const hashedPassword = "password123"
  const users = [
    new User({
      username: 'john_doe',
      email: 'john@example.com',
      password: hashedPassword,
    }),
    new User({
      username: 'jane_doe',
      email: 'jane@example.com',
      password: hashedPassword,
    }),
    new User({
      username: 'alice_johnson',
      email: 'alice@example.com',
      password: hashedPassword,
    }),
  ];

  for (const user of users) {
    await user.save();
  }

  // Create sample categories
  const categoryNames = ['Salary', 'Rent', 'Groceries', 'Utilities', 'Entertainment', 'Travel', 'Healthcare', 'Dining', 'Shopping', 'Investments', 'Savings', 'Insurance', 'Education', 'Gifts', 'Pets', 'Transportation', 'Fitness'];
  const categories = [];

  for (const user of users) {
    for (const categoryName of categoryNames) {
      const category = new Category({
        name: categoryName,
        user: user._id,
      });
      categories.push(category);
      await category.save();
    }
  }

  // Fetch category IDs after insertion
  const getCategoryByNameAndUser = (name, userId) => {
    return categories.find(cat => cat.name === name && cat.user.toString() === userId.toString())._id;
  };

  // Create sample transactions
  const transactionTypes = ['income', 'expense'];
  const recurringIntervals = [null, 'daily', 'weekly', 'monthly', 'yearly'];

  for (const user of users) {
    for (let i = 0; i < 50; i++) {
      const type = faker.helpers.arrayElement(transactionTypes);
      const category = faker.helpers.arrayElement(categoryNames);
      const amount = faker.finance.amount();
      const date = faker.date.between('2024-01-01', '2024-12-31');
      const recurring = faker.datatype.boolean();
      const recurringInterval = recurring ? faker.helpers.arrayElement(recurringIntervals) : null;

      const transaction = new Transaction({
        user: user._id,
        type: type,
        category: getCategoryByNameAndUser(category, user._id),
        amount: amount,
        date: date,
        recurring: recurring,
        recurringInterval: recurringInterval,
      });

      await transaction.save();
    }
  }

  console.log('Sample data inserted successfully');
  mongoose.connection.close();
};

seedDatabase();
