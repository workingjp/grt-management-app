const companyAccountService = require('../services/companyAccount.service');

const getCompanyAccounts = async (req, res) => {
  const accounts = await companyAccountService.getAllCompanyAccounts();
  res.status(200).json(accounts);
};

module.exports = { getCompanyAccounts };
