const express = require('express');
console.log("Company Account Routes Loaded");
const asyncHandler = require('../middleware/asyncHandler');
const { getCompanyAccounts } = require('../controllers/companyAccount.controller');

const router = express.Router();

router.get('/', asyncHandler(getCompanyAccounts));

module.exports = router;
