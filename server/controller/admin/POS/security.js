const { roles } = require('../../../config/roles');

const ProductDetails = require('../../../models/inventory/ProductDetails');
const Users = require('../../../models/User');

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

  checkIfAdmin: async (req, res, next) => {
    try {
      const { securityCode } = req.body;
      const users = await Users.findOne({ security_code: securityCode });
      if (users.role === 'admin') {
        return res.status(200).json({ userId: users.user_id, msg: 'Ok', success: true });
      } else {
        res.status(200).json({ msg: `Access denied!`, success: false });
      }
    } catch (err) {
      res.status(200).json({ msg: `Access Code doesn't exist`, success: false });
    }
  },
};
