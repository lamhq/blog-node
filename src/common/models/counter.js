const mongoose = require('mongoose');

const { Schema } = mongoose;

const counterSchema = new Schema({
  type: { type: String },
  value: { type: Number },
});

const Counter = mongoose.model('counters', counterSchema);

module.exports = Counter;
