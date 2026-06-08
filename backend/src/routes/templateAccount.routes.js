const express = require('express');
const asyncHandler = require('../middleware/asyncHandler');
const { deleteTemplateAccount } = require('../controllers/templateAccount.controller');

const router = express.Router();

router.delete('/:id', asyncHandler(deleteTemplateAccount));

module.exports = router;
