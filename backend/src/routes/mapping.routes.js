const express = require('express');
const {
  getMappings,
  createMapping,
  deleteMapping,
} = require('../controllers/mapping.controller');

const router = express.Router();

router.get('/', getMappings);
router.post('/', createMapping);
router.delete('/:id', deleteMapping);

module.exports = router;
