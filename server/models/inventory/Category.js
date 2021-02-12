const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  category_name: {
    type: String,
    required: true,
  },
  isActive: {
    type: String,
    default: "Yes",
    enum: ["Yes", "No"],
    required: true,
  },
  date_created: {
    type: Date,
    default: Date.now,
  },
  date_updated: {
    type: Date,
    required: true,
  },
});

const Category = mongoose.model("category", categorySchema);

module.exports = Category;
