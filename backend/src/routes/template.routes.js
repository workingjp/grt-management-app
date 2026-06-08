const express = require('express');
const { getMappingsByTemplate } = require('../controllers/mapping.controller');
const {
  getTemplates,
  createTemplate,
  getTemplateById,
  updateTemplate,
  deleteTemplate,
  createTemplateAccount,
} = require('../controllers/template.controller');

const router = express.Router();

router.get('/', getTemplates);
router.post('/', createTemplate);
router.get('/:id/mappings', getMappingsByTemplate);
router.get('/:id', getTemplateById);
router.put('/:id', updateTemplate);
router.delete('/:id', deleteTemplate);
router.post('/:id/accounts', createTemplateAccount);

module.exports = router;
