const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productInventorySchema = new Schema({
  prodId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'productDetails',
    // type: String,
    // required: true,
  },
  stock_onhand: {
    type: String,
    required: true,
  },
  //   unit: { type: String, required: true },
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

const productInventory = mongoose.model('productinventory', productInventorySchema);

module.exports = productInventory;
