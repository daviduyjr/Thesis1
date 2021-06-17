const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
  order_no: { type: String, required: true },
  list_of_orders: { type: String, required: true },
  VAT: { type: Number, required: false },
  VATSales: { type: Number, required: false },
  VatExempt: { type: Number, required: false },
  discount: { type: Number, required: false },
  total_amount: { type: Number, required: true },
  customer: { type: String, required: false },
  isDiscounted: { type: Boolean, required: true },
  adminId: { type: String, required: false },
});

const transaction = mongoose.model('transaction', transactionSchema);

module.exports = transaction;
