const templateService = require('../services/template.service');
const templateAccountService = require('../services/templateAccount.service');

const getTemplates = async (req, res) => {
  const templates = await templateService.getAllTemplates();
  res.status(200).json(templates);
};

const createTemplate = async (req, res) => {
  const template = await templateService.createTemplate(req.body.name);
  res.status(201).json(template);
};

const getTemplateById = async (req, res) => {
  const template = await templateService.getTemplateById(req.params.id);
  res.status(200).json(template);
};

const updateTemplate = async (req, res) => {
  const template = await templateService.updateTemplate(req.params.id, req.body.name);
  res.status(200).json(template);
};

const deleteTemplate = async (req, res) => {
  await templateService.deleteTemplate(req.params.id);
  res.status(200).json({ message: 'Template deleted successfully' });
};

const createTemplateAccount = async (req, res) => {
  const account = await templateAccountService.createTemplateAccount(
    req.params.id,
    req.body.name
  );
  res.status(201).json(account);
};

module.exports = {
  getTemplates,
  createTemplate,
  getTemplateById,
  updateTemplate,
  deleteTemplate,
  createTemplateAccount,
};
