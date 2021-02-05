const bcrypt = require("bcryptjs");
const Category = require("../../../models/products/Category");
const { roles } = require("../../../config/roles");

module.exports = {
  categoryList: async (req, res, next) => {
    const categories = await Category.find();
    if (categories.length === 0) {
      res.status(200).json({ categories: "No Data Available", success: true });
    } else {
      res.status(200).json({ categories: categories, success: true });
    }
  },

  addCategory: async (req, res, next) => {
    const { categoryName } = req.body;
    const foundCat = await Category.findOne({ category_name: categoryName });
    if (foundCat) {
      return res.status(400).json({
        msg: `Category "${categoryName}" is already in use`,
        success: false,
      });
    }

    const newCat = new Category({
      category_name: categoryName,
      date_updated: Date.now(),
    });

    await newCat.save().then((cat) => {
      res.status(200).json({
        success: true,
        message: "Succesfully Saved",
        category: cat,
      });
    });
  },

  updateCategoryName: async (req, res, next) => {
    const { category_name, _id } = req.body;

    let catToFind = await Category.findOne({ category_name });

    if (catToFind) {
      if (catToFind.id === _id) {
        return res.json("test");
      }
      return res
        .status(400)
        .json({ err: "Category Name already exist", success: false });
    }
    let result = await Category.findByIdAndUpdate(
      _id,
      { category_name, date_updated: Date.now() },
      {
        new: true,
        useFindAndModify: false,
      }
    );
    if (!result) {
      res.status(400).json({ err: "User doesn't exist", success: false });
    } else {
      res.status(200).json({ catName: result, success: true });
    }
  },
};
