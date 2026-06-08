const mappingService = require('../services/mapping.service');

const getMappings = async (req, res) => {
  const mappings = await mappingService.getMappingsByTemplateId(req.query.templateId);
  res.status(200).json(mappings);
};

const getMappingsByTemplate = async (req, res) => {
  const mappings = await mappingService.getMappingsByTemplateId(req.params.id);
  res.status(200).json(mappings);
};

const createMapping = async (req, res) => {
  const mapping = await mappingService.createMapping(
    req.body.templateAccountId,
    req.body.companyAccountId
  );
  res.status(201).json(mapping);
};

const deleteMapping = async (req, res) => {
  await mappingService.deleteMapping(req.params.id);
  res.status(200).json({ message: 'Mapping deleted successfully' });
};

module.exports = {
  getMappings,
  getMappingsByTemplate,
  createMapping,
  deleteMapping,
};
