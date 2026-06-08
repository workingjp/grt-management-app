const { Template, TemplateAccount, Mapping } = require('../models');
const AppError = require('../utils/AppError');
const { validateObjectId, validateName } = require('../utils/validation');

const createTemplateAccount = async (templateId, name) => {
  validateObjectId(templateId, 'template ID');
  const validName = validateName(name);

  const template = await Template.findById(templateId);
  if (!template) {
    throw new AppError('Template not found', 404);
  }

  const account = await TemplateAccount.create({
    templateId,
    name: validName,
  });

  return {
    id: account._id.toString(),
    templateId: account.templateId.toString(),
    name: account.name,
    createdAt: account.createdAt,
    updatedAt: account.updatedAt,
  };
};

const deleteTemplateAccount = async (id) => {
  validateObjectId(id, 'template account ID');

  const account = await TemplateAccount.findById(id);
  if (!account) {
    throw new AppError('Template account not found', 404);
  }

  await Mapping.deleteMany({ templateAccountId: id });
  await TemplateAccount.findByIdAndDelete(id);
};

module.exports = {
  createTemplateAccount,
  deleteTemplateAccount,
};
