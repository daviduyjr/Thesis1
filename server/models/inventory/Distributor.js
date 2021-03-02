const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const distributorSchema = new Schema({
  dist_no: {
    type: String,
    required: true,
  },
  distributor_name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  contact_number: {
    type: String,
    required: true,
  },
  date_created: {
    type: Date,
    default: Date.now,
  },
  date_updated: {
    type: Date,
    required: true,
  },
});

const Distributor = mongoose.model('distributor', distributorSchema);

module.exports = Distributor;
