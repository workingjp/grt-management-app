const mongoose = require('mongoose');

const mappingSchema = new mongoose.Schema(
  {
    templateAccountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TemplateAccount',
      required: true,
    },
    companyAccountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CompanyAccount',
      required: true,
    },
  },
  { timestamps: true }
);

mappingSchema.index({ templateAccountId: 1 });
mappingSchema.index({ companyAccountId: 1 });
mappingSchema.index({ templateAccountId: 1, companyAccountId: 1 }, { unique: true });

module.exports = mongoose.model('Mapping', mappingSchema);
