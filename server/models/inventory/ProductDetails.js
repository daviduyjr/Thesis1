const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const productDetailsSchema = new Schema({
  _id: {
    type: String,
    required: true,
  },
  product_name: {
    type: String,
    required: true,
  },
  orig_price: {
    type: Number,
    required: true,
  },
  SRP: {
    type: Number,
    required: true,
  },
  reseller_price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'category',
  },
  weight: {
    type: String,
    required: true,
  },

  isActive: {
    type: String,
    default: 'Yes',
    enum: ['Yes', 'No'],
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

const productDetails = mongoose.model('productDetails', productDetailsSchema);

module.exports = productDetails;
