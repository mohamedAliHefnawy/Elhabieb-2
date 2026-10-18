const mongoose = require("mongoose");

const DetailsSchema = new mongoose.Schema({
  color: { type: String },
  sizes: {
    type: [
      {
        size: { type: String },
        city: {
          type: String,
        },
        store: {
          type: String,
        },
        amount: {
          type: Number,
        },
      },
    ],
  },
});

const ProductDetailsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: "",
  },
  price: {
    type: Number,
    required: true,
    default: 0,
  },
  gainMarkter: {
    type: Number,
    required: true,
    default: 0,
  },
  priceMarkter: {
    type: Number,
    required: true,
    default: 0,
  },
  priceCustomer: {
    type: Number,
    required: true,
    default: 0,
  },
  colors: {
    type: [String],
    default: [],
  },
  images: {
    type: [String],
    default: [],
  },
  discrubtion: {
    type: String,
    default: "",
  },
  active: {
    type: Boolean,
    required: true,
    default: true,
  },
  catogry: {
    type: String,
    default: "",
  },
  dateAdded: {
    type: String,
    default: "",
  },
  timeAdded: {
    type: String,
    default: "",
  },
  numberSelles: {
    type: Number,
    default: 0,
  },
  details: {
    type: [DetailsSchema],
    required: true,
    default: [],
  },
  isCart: {
    type: Boolean,
  },
  isFavourite: {
    type: Boolean,
  },
});

const ProductsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: "",
  },
  price: {
    type: Number,
    required: true,
    default: 0,
  },
  gainMarkter: {
    type: Number,
    required: true,
    default: 0,
  },
  priceMarkter: {
    type: Number,
    required: true,
    default: 0,
  },
  priceCustomer: {
    type: Number,
    required: true,
    default: 0,
  },
  colors: {
    type: [String],
    default: [],
  },
  images: {
    type: [String],
    default: [],
  },
  discrubtion: {
    type: String,
    default: "",
  },
  active: {
    type: Boolean,
    required: true,
    default: true,
  },
  catogry: {
    type: String,
    default: "",
  },
  dateAdded: {
    type: String,
    default: "",
  },
  timeAdded: {
    type: String,
    default: "",
  },
  numberSelles: {
    type: Number,
    default: 0,
  },
  products: {
    type: [ProductDetailsSchema],
    default: [],
  },
  details: {
    type: [DetailsSchema],
    required: true,
    default: [],
  },
  isCart: {
    type: Boolean,
  },
  isFavourite: {
    type: Boolean,
  },
});

module.exports = mongoose.model("Products", ProductsSchema);
