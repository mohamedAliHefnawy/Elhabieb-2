const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
});

const CartSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  products: {
    type: [ProductSchema], 
    default: [],
  },
});

module.exports = mongoose.model("Cart", CartSchema);
