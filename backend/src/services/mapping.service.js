const { Template, TemplateAccount, CompanyAccount, Mapping } = require('../models');
const AppError = require('../utils/AppError');
const { validateObjectId } = require('../utils/validation');

const getMappingsByTemplateId = async (templateId) => {
  validateObjectId(templateId, 'template ID');

  const template = await Template.findById(templateId);
  if (!template) {
    throw new AppError('Template not found', 404);
  }

  const templateAccountIds = await TemplateAccount.find({ templateId }).distinct('_id');

  if (templateAccountIds.length === 0) {
    return [];
  }

  const mappings = await Mapping.find({
    templateAccountId: { $in: templateAccountIds },
  }).lean();

  const companyAccountIds = mappings.map((mapping) => mapping.companyAccountId);
  const companyAccounts = await CompanyAccount.find({
    _id: { $in: companyAccountIds },
  }).lean();

  const companyAccountMap = new Map(
    companyAccounts.map((account) => [account._id.toString(), account.name])
  );

  return mappings.map((mapping) => ({
    id: mapping._id.toString(),
    templateAccountId: mapping.templateAccountId.toString(),
    companyAccountId: mapping.companyAccountId.toString(),
    companyAccountName: companyAccountMap.get(mapping.companyAccountId.toString()) || '',
  }));
};

const createMapping = async (templateAccountId, companyAccountId) => {
  validateObjectId(templateAccountId, 'template account ID');
  validateObjectId(companyAccountId, 'company account ID');

  const templateAccount = await TemplateAccount.findById(templateAccountId);
  if (!templateAccount) {
    throw new AppError('Template account not found', 404);
  }

  const companyAccount = await CompanyAccount.findById(companyAccountId);
  if (!companyAccount) {
    throw new AppError('Company account not found', 404);
  }

  try {
    const mapping = await Mapping.create({ templateAccountId, companyAccountId });

    return {
      id: mapping._id.toString(),
      templateAccountId: mapping.templateAccountId.toString(),
      companyAccountId: mapping.companyAccountId.toString(),
      companyAccountName: companyAccount.name,
    };
  } catch (error) {
    if (error.code === 11000) {
      throw new AppError('Mapping already exists', 409);
    }
    throw error;
  }
};

const deleteMapping = async (id) => {
  validateObjectId(id, 'mapping ID');

  const mapping = await Mapping.findByIdAndDelete(id);
  if (!mapping) {
    throw new AppError('Mapping not found', 404);
  }
};

module.exports = {
  getMappingsByTemplateId,
  createMapping,
  deleteMapping,
};
