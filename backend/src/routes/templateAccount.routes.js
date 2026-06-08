const express = require('express');
console.log("Template Account Routes Loaded");
const asyncHandler = require('../middleware/asyncHandler');
const { deleteTemplateAccount } = require('../controllers/templateAccount.controller');

const router = express.Router();

router.delete('/:id', asyncHandler(deleteTemplateAccount));

module.exports = router;
