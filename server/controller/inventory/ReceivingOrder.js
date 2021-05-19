const { roles } = require('../../config/roles');

const ReceivingOrder = require('../../models/inventory/RecievingOrder');
const ReceivingProducts = require('../../models/inventory/ReceivingProduct');
const Category = require('../../models/inventory/Category');
const ProductDetails = require('../../models/inventory/ProductDetails');
const Counter = require('../../models/inventory/counter');
const receivingOrder = require('../../models/inventory/RecievingOrder');

module.exports = {
  getReceivingOrderList: async (req, res, next) => {
    const RO = await ReceivingOrder.find().populate({
      path: 'receiving_products',
      populate: { path: 'product', select: 'product_name', model: ProductDetails },
    });

    res.status(200).json({ result: RO, success: true });
  },

  addRecievingOrder: async (req, res, next) => {
    const { products } = req.body;
    const productList = [];
    const RPCode = await generateRPCode();
    var total = 0;
    products.forEach(async (prod) => {
      try {
        const newRecieveProducts = new ReceivingProducts({
          receiving_product_code: RPCode,
          product: prod.product,
          unit_per_case: prod.unit_per_case,
          unit_per_box: prod.unit_per_box,
          unit_per_pc: prod.unit_per_pc,
          total_no_pcs: prod.total_no_pcs,
          unit_price: prod.unit_price,
          cost_price: prod.cost_price,
        });
        total += prod.cost_price;
        productList.push(newRecieveProducts._id);
        await newRecieveProducts.save();
      } catch (err) {
        console.log(err);
      }
    });
    const receivingOrder = new ReceivingOrder({
      receiving_code: RPCode,
      receiving_products: productList,
      total_amount: total,
    });

    await receivingOrder.save().then((data) => {
      setTimeout(async () => {
        const RO = await ReceivingOrder.findById({ _id: data._id }).populate({
          path: 'receiving_products',
          populate: { path: 'product', select: 'product_name', model: ProductDetails },
        });
        res.status(200).json({ result: RO, success: true });
      }, 1000);
    });
  },
};

const generateRPCode = async () => {
  try {
    const id = 'RP';
    const updateCounter = await Counter.findOneAndUpdate(
      { id: 'RP' },
      { $inc: { seq: 1 } },
      { new: true, useFindAndModify: false }
    );

    if (!updateCounter) {
      const newCounter = await new Counter({ id: 'RP', seq: 1 });
      await newCounter.save();
    }

    const getSeq = await Counter.findOne({ id: id });

    const counterToReturn = `${id}-0${getSeq.seq}`;
    return counterToReturn;
  } catch (err) {
    return err;
  }
};
