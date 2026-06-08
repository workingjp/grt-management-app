const express = require('express');
const asyncHandler = require('../middleware/asyncHandler');
const { getCompanyAccounts } = require('../controllers/companyAccount.controller');

const router = express.Router();

router.get('/', asyncHandler(getCompanyAccounts));

module.exports = router;
