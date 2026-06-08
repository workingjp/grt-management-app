const { Template, TemplateAccount, Mapping } = require('../models');
const AppError = require('../utils/AppError');
const { validateObjectId, validateName } = require('../utils/validation');

const getAccountCountsByTemplate = async () => {
  const counts = await TemplateAccount.aggregate([
    {
      $lookup: {
        from: Mapping.collection.name,
        localField: '_id',
        foreignField: 'templateAccountId',
        as: 'mappings',
      },
    },
    {
      $group: {
        _id: '$templateId',
        totalAccounts: { $sum: 1 },
        mappedAccounts: {
          $sum: { $cond: [{ $gt: [{ $size: '$mappings' }, 0] }, 1, 0] },
        },
      },
    },
  ]);

  const countsMap = new Map();
  counts.forEach((entry) => {
    countsMap.set(entry._id.toString(), {
      mappedAccountsCount: entry.mappedAccounts,
      unmappedAccountsCount: entry.totalAccounts - entry.mappedAccounts,
    });
  });

  return countsMap;
};

const getAllTemplates = async () => {
  const templates = await Template.find().sort({ createdAt: -1 }).lean();
  const countsMap = await getAccountCountsByTemplate();

  return templates.map((template) => {
    const counts = countsMap.get(template._id.toString()) || {
      mappedAccountsCount: 0,
      unmappedAccountsCount: 0,
    };

    return {
      id: template._id.toString(),
      name: template.name,
      group: template.group,
      mappedAccountsCount: counts.mappedAccountsCount,
      unmappedAccountsCount: counts.unmappedAccountsCount,
    };
  });
};

const createTemplate = async (name) => {
  const validName = validateName(name);
  const template = await Template.create({ name: validName });

  return {
    id: template._id.toString(),
    name: template.name,
    group: template.group,
    mappedAccountsCount: 0,
    unmappedAccountsCount: 0,
  };
};

const getTemplateById = async (id) => {
  validateObjectId(id, 'template ID');

  const template = await Template.findById(id).lean();
  if (!template) {
    throw new AppError('Template not found', 404);
  }

  const accounts = await TemplateAccount.find({ templateId: id })
    .sort({ createdAt: 1 })
    .lean();

  return {
    id: template._id.toString(),
    name: template.name,
    group: template.group,
    templateAccounts: accounts.map((account) => ({
      id: account._id.toString(),
      name: account.name,
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
    })),
  };
};

const updateTemplate = async (id, name) => {
  validateObjectId(id, 'template ID');
  const validName = validateName(name);

  const template = await Template.findByIdAndUpdate(
    id,
    { name: validName },
    { new: true, runValidators: true }
  );

  if (!template) {
    throw new AppError('Template not found', 404);
  }

  return {
    id: template._id.toString(),
    name: template.name,
    group: template.group,
  };
};

const deleteTemplate = async (id) => {
  validateObjectId(id, 'template ID');

  const template = await Template.findById(id);
  if (!template) {
    throw new AppError('Template not found', 404);
  }

  const accountIds = await TemplateAccount.find({ templateId: id }).distinct('_id');

  if (accountIds.length > 0) {
    await Mapping.deleteMany({ templateAccountId: { $in: accountIds } });
    await TemplateAccount.deleteMany({ templateId: id });
  }

  await Template.findByIdAndDelete(id);
};

module.exports = {
  getAllTemplates,
  createTemplate,
  getTemplateById,
  updateTemplate,
  deleteTemplate,
};
