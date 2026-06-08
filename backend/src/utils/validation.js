const mongoose = require('mongoose');
const AppError = require('./AppError');

const validateObjectId = (id, label = 'ID') => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(`Invalid ${label}`, 400);
  }
};

const validateName = (name, fieldName = 'name') => {
  if (!name || typeof name !== 'string' || !name.trim()) {
    throw new AppError(`${fieldName} is required`, 400);
  }
  return name.trim();
};

module.exports = { validateObjectId, validateName };
