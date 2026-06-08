const express = require('express');
console.log("Health Routes Loaded");
const { getHealth } = require('../controllers/health.controller');

const router = express.Router();

router.get('/health', getHealth);

module.exports = router;
