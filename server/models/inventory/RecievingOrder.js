const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const receivingOrderSchema = new Schema({
  receiving_code: {
    type: String,
    required: true,
  },
  receiving_products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'receivingproduct',
    },
  ],
  // receiving_products: {
  //   type: String,
  //   required: true,
  // },

  total_amount: {
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

const receivingOrder = mongoose.model('receivingorder', receivingOrderSchema);

module.exports = receivingOrder;
