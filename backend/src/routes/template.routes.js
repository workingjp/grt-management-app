const express = require('express');
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
router.get('/:id', getTemplateById);
router.put('/:id', updateTemplate);
router.delete('/:id', deleteTemplate);
router.post('/:id/accounts', createTemplateAccount);

module.exports = router;
