const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  numerOrder: {
    type: Number,
    default: 100,
  },
  markter: {
    type: String,
  },
  vaildity: {
    type: String,
  },
  client: {
    type: String,
  },
  phoneMain: {
    type: String,
  },
  phoneAlternative: {
    type: String,
  },
  city: {
    type: String,
  },
  placeDetails: {
    type: String,
  },
  date: {
    type: String,
  },
  time: {
    type: String,
  },
  priceProducts: {
    type: Number,
  },
  gainAdmin: {
    type: Number,
  },
  gainMarkter: {
    type: Number,
  },
  priceDelivery: {
    type: Number,
  },
  totalPrice: {
    type: Number,
  },
  delivery: {
    type: String,
    default: "",
  },
  company: {
    type: {
      name: { type: String },
      image: { type: String },
      phone: { type: String },
      color: { type: String },
    },
    default: { name: "", image: "", phone: "", color: "" },
  },
  products: {
    type: [
      {
        idProduct: String,
        nameProduct: String,
        colorProduct: String,
        sizeProduct: String,
        priceProduct: Number,
        gainMarkter: Number,
        priceMarkter: Number,
        priceCustomer: Number,
        imageProduct: String,
        storeProduct: String,
        cityProduct: String,
        amountProduct: Number,
        amountNewProduct: {
          type: Number,
          default: null,
        },
      },
    ],
  },
  casesOrder: {
    type: [
      {
        case: { type: String },
        date: {
          type: String,
        },
        time: {
          type: String,
        },
      },
    ],
  },
  chat: {
    type: [
      {
        message: { type: String },
        nameSender: { type: String },
        vaildity: { type: String },
        date: { type: String },
        time: { type: String },
        showUser: { type: Boolean },
        showAdmin: { type: Boolean },
        showEmploy: { type: Boolean },
        showDelivery: { type: Boolean },
      },
    ],
  },
});

module.exports = mongoose.model("Order", OrderSchema);
