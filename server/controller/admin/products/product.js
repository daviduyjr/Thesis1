const bcrypt = require('bcryptjs');
const { roles } = require('../../../config/roles');

const ProductDetails = require('../../../models/inventory/ProductDetails');
const Category = require('../../../models/inventory/Category');
const Counter = require('../../../models/inventory/counter');

module.exports = {
  grantAccess: (action, resource) => {
    return async (req, res, next) => {
      try {
        const permission = roles.can(req.user.role)[action](resource);
        if (!permission.granted) {
          return res.status(401).json({
            error: "You don't have enough permission to perform this action",
          });
        }
        next();
      } catch (error) {
        next(error);
      }
    };
  },

  addProduct: async (req, res, next) => {
    try {
      //const role = req.user.role;

      const test = {
        product_code: req.body.product_code,
        product_name: req.body.product_name,
        orig_price: req.body.orig_price,
        SRP: req.body.SRP,
        reseller_price: req.body.reseller_price,
        description: req.body.description,
        cat_id: req.body.cat_id,
        weight: req.body.weight,
      };

      const findProduct = await ProductDetails.findOne({ product_name: test.product_name.toUpperCase() });

      if (findProduct) {
        return res.status(400).json({ msg: `Product Name ${findProduct.product_name} already exist`, success: false });
      }
      const ProductCodeTeset = await prodCode(test.cat_id);

      const newProduct = new ProductDetails({
        product_code: ProductCodeTeset,
        product_name: req.body.product_name.toUpperCase(),
        orig_price: req.body.orig_price,
        SRP: req.body.SRP,
        reseller_price: req.body.reseller_price,
        description: req.body.description,
        cat_id: req.body.cat_id,
        weight: req.body.weight,
        date_updated: Date.now(),
      });

      await newProduct.save().then((prod) => {
        res.status(200).json({
          success: true,
          message: 'Succesfully Saved',
          product: prod,
        });
      });
    } catch (err) {
      res.status(400).json({ msg: err, success: false });
    }
    // const foundCat = await ProductDetails.findOne({ category_name: categoryName.toUpperCase() });
    // if (foundCat) {
    //   return res.status(400).json({
    //     msg: `Category "${categoryName.toUpperCase()}" is already in use`,
    //     success: false,
    //   });
    // }

    // const newCat = new ProductDetails({
    //   category_name: categoryName.toUpperCase(),
    //   date_updated: Date.now(),
    // });

    // await newCat.save().then((cat) => {
    //   res.status(200).json({
    //     success: true,
    //     message: 'Succesfully Saved',
    //     category: cat,
    //   });
    // });
  },
};

var prodCode = async (catid) => {
  try {
    const cat = await Category.findById({ _id: catid });

    const catAbbv = cat.category_abbreviation;

    const dist = await Counter.findOneAndUpdate({ id: catAbbv }, { $inc: { seq: 1 } }, { new: true, useFindAndModify: false });

    const productCode = await Counter.findOne({ id: catAbbv });

    const prodId = productCode.id;

    const newproductCode = `${prodId}-0${productCode.seq}`;
    return newproductCode;
  } catch (err) {
    return err;
  }
};
