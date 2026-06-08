const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    group: {
      type: String,
      default: 'SaaS',
      trim: true,
    },
  },
  { timestamps: true }
);

templateSchema.index({ name: 1 });
templateSchema.index({ group: 1 });

module.exports = mongoose.model('Template', templateSchema);
