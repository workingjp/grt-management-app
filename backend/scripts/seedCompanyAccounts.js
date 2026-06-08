require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const connectDB = require('../src/config/database');
const { CompanyAccount } = require('../src/models');

const seedData = [
  { name: 'Revenue', category: 'Income' },
  { name: 'Cost of Goods Sold', category: 'Expense' },
  { name: 'Marketing Expenses', category: 'Expense' },
  { name: 'Salaries', category: 'Expense' },
  { name: 'Office Rent', category: 'Expense' },
  { name: 'Software Licenses', category: 'Expense' },
];

const seedCompanyAccounts = async () => {
  await connectDB();

  await CompanyAccount.deleteMany({});
  const inserted = await CompanyAccount.insertMany(seedData);

  console.log(`Seeded ${inserted.length} company accounts.`);
};

seedCompanyAccounts()
  .then(async () => {
    const mongoose = require('mongoose');
    await mongoose.disconnect();
    process.exit(0);
  })
  .catch(async (err) => {
    console.error('Seed failed:', err);
    const mongoose = require('mongoose');
    await mongoose.disconnect();
    process.exit(1);
  });
