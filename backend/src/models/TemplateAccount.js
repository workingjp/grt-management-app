const mongoose = require('mongoose');

const templateAccountSchema = new mongoose.Schema(
  {
    templateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Template',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

templateAccountSchema.index({ templateId: 1 });
templateAccountSchema.index({ templateId: 1, name: 1 });

module.exports = mongoose.model('TemplateAccount', templateAccountSchema);
