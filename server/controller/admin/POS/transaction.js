const { compareSync } = require('bcryptjs');
const { roles } = require('../../../config/roles');

const ProductDetails = require('../../../models/inventory/ProductDetails');
const ProductInventory = require('../../../models/inventory/ProductInventory');
const Users = require('../../../models/User');
const Customer = require('../../../models/Customers/Customer');
const Transaction = require('../../../models/Transactions/transasctions');
const Counter = require('../../../models/inventory/counter');

module.exports = {
  payment: async (req, res, next) => {
    try {
      const { orderNo, VATSales, VatExempt, VAT, discount, totalDue, adminId, customer, isDiscounted } = req.body.data;
      let orders = [];
      await req.body.data.orderList.forEach(async (item) => {
        try {
          const test = Number(item.quantity);

          orders.push({
            prodId: item.id,
            quantity: item.quantity,
            total: item.total,
          });

          await ProductInventory.update({ prodId: item.id }, { $inc: { stock_onhand: -test } }).then((data) => {
            console.log(data);
          });
        } catch (err) {
          console.log(err);
        }
      });

      const newTransaction = await new Transaction({
        order_no: orderNo,
        list_of_orders: orderNo,
        VAT: Number(VAT.replace(/\₱|,/g, '')),
        VATSales: Number(VATSales.replace(/\₱|,/g, '')),
        VatExempt: Number(VatExempt.replace(/\₱|,/g, '')),
        discount: Number(discount.replace(/\₱|,/g, '')),
        total_amount: Number(totalDue.replace(/\₱|,/g, '')),
        customer: customer,
        isDiscounted: isDiscounted,
        adminId: adminId,
      });
      console.log(newTransaction);
      // console.log(req.body.data.customer);
    } catch (err) {
      console.log(err);
    }
  },
};

var order_no = async () => {
  try {
    const orderNoId = 'orderNo';
    const orderNo = 0;
    //check kung may orderNo na sa db, pag wala gumawa ng bago

    const latestOrderId = await new Promise((resolve, reject) => {
      Counter.findOneAndUpdate({ id: orderNoId }, { $inc: { seq: 1 } }, { new: true, useFindAndModify: false }, async (error, result) => {
        if (error) {
          console.error(JSON.stringify(error));
          return reject(error);
        }
        if (!result) {
          c = await new Counter({ id: orderNoId, seq: 1 });
          await c.save();
        }
        const newOr = await Counter.findOne({ id: orderNoId });
        // const orderId = newOr.id;

        const newOrderIdCode = `0${newOr.seq}`;
        resolve(newOrderIdCode);
      });
    });

    return latestOrderId;
  } catch (err) {
    return err;
  }
};
