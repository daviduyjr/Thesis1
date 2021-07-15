const { compareSync } = require('bcryptjs');
const { roles } = require('../../../config/roles');

const Category = require('../../../models/inventory/Category');
const ProductDetails = require('../../../models/inventory/ProductDetails');
const ProductInventory = require('../../../models/inventory/ProductInventory');
const Users = require('../../../models/User');
const Customer = require('../../../models/Customers/Customer');
const Transaction = require('../../../models/Transactions/transasctions');
const Counter = require('../../../models/inventory/counter');

module.exports = {
  payment: async (req, res, next) => {
    try {
      const { orderNo, VATSales, VatExempt, VAT, discount, totalDue, cash, change, cashierId, adminId, customer, isDiscounted } = req.body.data;
      console.log('cash', cash, 'change', change, 'total', parseFloat(totalDue.replace(/\₱|,/g, '')));
      let orders = [];
      await req.body.data.orderList.forEach(async (item) => {
        try {
          const quantity = Number(item.quantity);

          orders.push({
            prodId: item.id,
            quantity: Number(item.quantity),
            total: Number(item.total.replace(/\₱|,/g, '')),
          });

          await ProductInventory.update({ prodId: item.id }, { $inc: { stock_onhand: -quantity } }).then((data) => {
            console.log(data);
          });
        } catch (err) {
          console.log(err);
        }
      });
      //console.log('orders', orders);
      const newTransaction = await new Transaction({
        order_no: orderNo,
        list_of_orders: orders,
        VAT: Number(VAT.replace(/\₱|,/g, '')),
        VATSales: Number(VATSales.replace(/\₱|,/g, '')),
        VatExempt: Number(VatExempt.replace(/\₱|,/g, '')),
        discount: Number(discount.replace(/\₱|,/g, '')),
        total_amount: Number(totalDue.replace(/\₱|,/g, '')),
        cash: Number(cash),
        change: Number(change),
        customer: customer.id_no,
        isDiscounted: isDiscounted,
        adminId: adminId,
        cashierId,
      });

      const test = await updateOrder();
      console.log(test);
      newTransaction
        .save()
        .then((data) => {
          res.status(200).json({ trans: data, success: true });
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  },

  returnItems: async (req, res, next) => {
    try {
      await req.body.data.items.forEach(async (data) => {
        const updatedItems = await Transaction.findOneAndUpdate(
          { order_no: req.body.data.order_no, list_of_orders: { $elemMatch: { prodId: data.prodId } } },
          { $set: { 'list_of_orders.$.isVoid': true } },
          { new: true },
          (err, doc) => {
            if (err) {
              console.log(err);
              return;
            }
            return doc;
          }
        );
        // console.log('updatedItems', updatedItems);
      });
      // console.log('test', test);
    } catch (err) {
      console.log(err);
    }
  },
  getTransactionById: async (req, res, next) => {
    try {
      const id = req.params.id;

      const trans = await Transaction.findOne({ order_no: id })
        .populate({
          path: 'list_of_orders.prodId',
          model: ProductDetails,
          select: ['_id', 'product_name', 'SRP'],
          populate: { path: 'category', select: 'category_name', model: Category },
        })
        .populate({
          path: 'cashierId',
          model: Users,
          select: ['name', 'role'],
        })
        .populate({
          path: 'customer',
          model: Customer,
          select: ['full_name', 'type'],
        });
      if (trans == null) {
        res.status(200).json({ errMsg: "Transaction doesn't exist.", success: false });
        return;
      }
      console.log(trans);
      res.status(200).json({ trans: trans, success: true });
    } catch (err) {
      res.status(200).json({ errMsg: "Transaction doesn't exist.", success: false });
    }
  },
};

var updateOrder = async () => {
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
