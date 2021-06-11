const { compareSync } = require('bcryptjs');
const { roles } = require('../../../config/roles');

const ProductDetails = require('../../../models/inventory/ProductDetails');
const Users = require('../../../models/User');

module.exports = {
  payment: async (req, res, next) => {
    let orders = [];
    await req.body.data.orderList.forEach((item) => {
      orders.push({
        prodId: item.id,
        quantity: item.quantity,
        total: item.total,
      });
    });
    console.log(orders);
    console.log(req.body.data.customer);
  },
};
