const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
  order_no: { type: String, required: true },
  list_of_orders: [{ prodId: String, quantity: Number, total: Number }],
  VAT: { type: Number, required: false },
  VATSales: { type: Number, required: false },
  VatExempt: { type: Number, required: false },
  discount: { type: Number, required: false },
  total_amount: { type: Number, required: true },
  cash: { type: Number, required: true },
  change: { type: Number, required: true },
  customer: { id_no: Number, full_name: String, custType: String },
  isDiscounted: { type: Boolean, required: true },
  adminId: { type: String, required: false },
  cashierId: { type: String, required: true },
});

const transaction = mongoose.model('transaction', transactionSchema);

module.exports = transaction;
