const { CompanyAccount } = require('../models');

const getAllCompanyAccounts = async () => {
  const accounts = await CompanyAccount.find().sort({ name: 1 }).lean();

  return accounts.map((account) => ({
    id: account._id.toString(),
    name: account.name,
    category: account.category ?? null,
    createdAt: account.createdAt,
    updatedAt: account.updatedAt,
  }));
};

module.exports = { getAllCompanyAccounts };
