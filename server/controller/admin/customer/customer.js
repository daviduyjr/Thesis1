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
      const { id_no, full_name, type } = req.body;

      const newCustomer = new Customer({
        id_no: id_no,
        full_name: full_name,
        type: type,
      });

      newCustomer.save().then((data) => {
        res.status(200).json({
          success: true,
          message: 'Succesfully Saved',
          customer: data,
        });
      });
    } catch (err) {}
  },
};
