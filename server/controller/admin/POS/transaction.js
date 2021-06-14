const { compareSync } = require('bcryptjs');
const { roles } = require('../../../config/roles');

const ProductDetails = require('../../../models/inventory/ProductDetails');
const ProductInventory = require('../../../models/inventory/ProductInventory');
const Users = require('../../../models/User');

module.exports = {
  payment: async (req, res, next) => {
    try {
      let orders = [];
      await req.body.data.orderList.forEach(async (item) => {
        try {
          orders.push({
            prodId: item.id,
            quantity: item.quantity,
            total: item.total,
          });
          console.log(item.id);
          await ProductInventory.update({ prodId: item.id }, { $inc: { stockonHand: -item.quantity } }).then((data) => {
            console.log(data);
          });
        } catch (err) {
          console.log(err);
        }
      });

      console.log(orders);
      console.log(req.body.data.customer);
    } catch (err) {
      console.log(err);
    }
  },
};
