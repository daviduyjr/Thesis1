const bcrypt = require('bcryptjs');
const Category = require('../../../models/inventory/Category');
const { roles } = require('../../../config/roles');

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
  categoryList: async (req, res, next) => {
    const categories = await Category.find();
    if (categories.length === 0) {
      res.status(200).json({ categories: 'No Data Available', success: true });
    } else {
      res.status(200).json({ categories: categories, success: true });
    }
  },

  addCategory: async (req, res, next) => {
    // const role = req.user.role;
    // const permission = roles.can(role).createAny('category');
    // if (permission.granted) {
    console.log('granted');
    const { categoryName, category_abbreviation } = req.body;

    const findAbbv = await Counter.findOne({ id: category_abbreviation.toUpperCase() });

    if (findAbbv) {
      return res.status(400).json({
        msg: `Abbreviation "${category_abbreviation.toUpperCase()}" is already in use`,
        success: false,
      });
    }

    c = await new Counter({ id: category_abbreviation.toUpperCase(), seq: 1 });
    await c.save();

    const foundCat = await Category.findOne({ category_name: categoryName.toUpperCase() });
    if (foundCat) {
      return res.status(400).json({
        msg: `Category "${categoryName.toUpperCase()}" is already in use`,
        success: false,
      });
    }

    const newCat = new Category({
      category_name: categoryName.toUpperCase(),
      category_abbreviation: category_abbreviation.toUpperCase(),
      date_updated: Date.now(),
    });

    await newCat.save().then((cat) => {
      res.status(200).json({
        success: true,
        message: 'Succesfully Saved',
        category: cat,
      });
    });
    // } else {
    //   res.status(403).end();
    // }
  },

  updateCategoryName: async (req, res, next) => {
    try {
      const { category_name, catStatus, _id } = req.body;
      const cat = await Category.findById(_id);
      const catName = category_name.toUpperCase();

      if (cat) {
        if (cat.category_name === category_name.toUpperCase()) {
          updateCatName(catName, catStatus, _id).then((data) => {
            return res.status(200).json({ categories: data, success: true });
          });
        } else {
          let catNameToFind = await Category.findOne({ category_name: catName });

          if (catNameToFind) {
            return res.status(400).json({ err: `Category ${catName} already exist`, success: false });
          } else {
            updateCatName(catName, catStatus, _id).then((data) => {
              return res.status(200).json({ categories: data, success: true });
            });
          }
        }
      }
    } catch (err) {
      res.status(400).json({ err: "Category doesn't exist", success: false });
    }
  },
};

var updateCatName = async (category_name, catStatus, _id) => {
  let result = await Category.findByIdAndUpdate(
    _id,
    { category_name, isActive: catStatus, date_updated: Date.now() },
    {
      new: true,
      useFindAndModify: false,
    }
  );
  if (!result) {
    const err = 'may mali eh';
    return err;
  } else {
    return result;
  }
};
