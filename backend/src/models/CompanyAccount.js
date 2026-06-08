const mongoose = require('mongoose');

const companyAccountSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

companyAccountSchema.index({ name: 1 });
companyAccountSchema.index({ category: 1 });

module.exports = mongoose.model('CompanyAccount', companyAccountSchema);
