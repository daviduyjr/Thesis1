const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
  _id: {
    type: String,
    required: true,
  },
  full_name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: 'none',
    enum: ['none', 'SENIOR', 'PWD'],
    required: true,
  },
  date_created: {
    type: Date,
    default: Date.now,
  },
  date_updated: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const Customer = mongoose.model('customer', CustomerSchema);

module.exports = Customer;
