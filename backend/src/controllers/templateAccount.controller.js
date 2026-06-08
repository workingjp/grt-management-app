const templateAccountService = require('../services/templateAccount.service');

const deleteTemplateAccount = async (req, res) => {
  await templateAccountService.deleteTemplateAccount(req.params.id);
  res.status(200).json({ message: 'Template account deleted successfully' });
};

module.exports = { deleteTemplateAccount };
