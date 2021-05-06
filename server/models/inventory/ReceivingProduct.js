const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const receivingProductSchema = new Schema({
  receiving_product_code: {
    type: String,
    required: true,
  },
  product: {
    // type: mongoose.Schema.Types.ObjectId,
    // ref: 'productDetails',
    type: String,
    required: true,
  },
  unit_per_case: {
    type: Number,
    required: true,
    default: 1,
  },
  unit_per_box: {
    type: Number,
    required: true,
  },
  unit_per_pc: {
    type: Number,
    required: true,
  },
  total_no_pcs: {
    type: Number,
    required: true,
  },
  unit_price: {
    type: Number,
    required: true,
  },
  cost_price: {
    type: Number,
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

const recievingProducts = mongoose.model('receivingproduct', receivingProductSchema);

module.exports = recievingProducts;
