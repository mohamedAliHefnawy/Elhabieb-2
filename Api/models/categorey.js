const mongoose = require("mongoose");

const CategoriesSchema = new mongoose.Schema({
  image: {
    type: String,
  },
  name: {
    type: String,
    required: true,
  },
  Active: {
    type: Boolean,
    required: true,
  },
  dateAdded: {
    type: String,
  },
  timeAdded: {
    type: String,
  },
  products: {
    type: [],
  },
});

module.exports = mongoose.model("Categories", CategoriesSchema);
