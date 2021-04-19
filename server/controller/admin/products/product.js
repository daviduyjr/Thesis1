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

  productLList: async (req, res, next) => {
    try {
      const products = await ProductDetails.find().populate({ path: 'category', model: Category });
      if (products.length === 0) {
        res.status(400).json({ msg: 'No data available', success: false });
      } else {
        res.status(200).json({ products: products, success: true });
      }
    } catch (err) {
      console.log(err);
      res.status(400).json({ msg: err, success: false });
    }
  },

  addProduct: async (req, res, next) => {
    try {
      const prod = {
        _id: req.body.id,
        product_name: req.body.product_name,
        orig_price: req.body.orig_price,
        SRP: req.body.SRP,
        reseller_price: req.body.reseller_price,
        description: req.body.description,
        category: req.body.category,
        weight: req.body.weight,
      };

      const findProduct = await ProductDetails.findOne({ product_name: prod.product_name.toUpperCase() });

      if (findProduct) {
        return res.status(400).json({ msg: `Product Name ${findProduct.product_name} already exist`, success: false });
      }
      const ProductCodeTeset = await prodCode(prod.category);

      const newProduct = new ProductDetails({
        _id: ProductCodeTeset,
        product_name: prod.product_name.toUpperCase(),
        orig_price: prod.orig_price,
        SRP: prod.SRP,
        reseller_price: prod.reseller_price,
        description: prod.description,
        category: prod.category,
        weight: prod.weight,
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
  //Pang generate ng product code, depende sa category
  try {
    const cat = await Category.findById({ _id: catid });

    const catAbbv = cat.category_abbreviation;

    const prod = await new Promise((resolve, reject) => {
      Counter.findOneAndUpdate({ id: catAbbv }, { $inc: { seq: 1 } }, { new: true, useFindAndModify: false }, (error, result) => {
        if (error) {
          console.error(JSON.stringify(error));
          return reject(error);
        }

        const prodId = result.id;

        const newproductCode = `${prodId}-0${result.seq}`;
        resolve(newproductCode);
      });
    });

    return prod;
  } catch (err) {
    return err;
  }
};
