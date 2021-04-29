const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productInventorySchema = new Schema({
  prodId: {
    type: String,
    // type: mongoose.Schema.Types.ObjectId,
    // ref: 'productDetails',
    required: true,
  },
  quantity: {
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

const productInventory = mongoose.model('productinventory', productInventorySchema);

module.exports = productInventory;
