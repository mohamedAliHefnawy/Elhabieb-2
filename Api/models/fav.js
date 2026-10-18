const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
  },
});

const FavSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  products: {
    type: [ProductSchema],
    default: [],
  },
});

module.exports = mongoose.model("Fav", FavSchema);
