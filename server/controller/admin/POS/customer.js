const { roles } = require('../../../config/roles');

const ProductDetails = require('../../../models/inventory/ProductDetails');
const ProductInventory = require('../../../models/inventory/ProductInventory');
const Category = require('../../../models/inventory/Category');
const Customer = require('../../../models/Customers/Customer');
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

  CustomerList: async (req, res, next) => {
    try {
      const list = await Customer.find();
      res.status(200).json({ customers: list, success: true });
    } catch (err) {}
  },

  AddCustomer: async (req, res, next) => {
    try {
      const custType = req.body.customer.type;
      const checkIfExisting = await Customer.findOne({ id_no: req.body.customer.id_no });

      if (checkIfExisting) {
        res.status(200).json({
          success: false,
          message: 'Already existing',
        });
        return;
      }

      const newCustomer = new Customer({
        _id: `${custType}-${req.body.customer.id_no}`,
        full_name: req.body.customer.full_name,
        type: req.body.customer.type,
      });

      newCustomer.save().then((data) => {
        res.status(200).json({
          success: true,
          message: 'Succesfully Saved',
          customer: data,
        });
      });
    } catch (err) {
      res.status(200).json({
        success: false,
        message: 'Error',
      });
    }
  },
};
