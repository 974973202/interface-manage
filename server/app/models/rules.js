const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const rulesSchema = new Schema({
  __v: { type: Number, select: false },
  ruleName: { type: String, required: true },
  interfaceList: { type: [] },
  remark: { type: String },
  person: { type: String },
  data: { type: Date, default: Date.now },
});

module.exports = model('Ruels', rulesSchema);
