const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  image: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
  },
  firstName: {
    type: String,
  },
  secondName: {
    type: String,
  },
  password: {
    type: String,
  },
  passwordWallet: {
    type: String,
  },
  validity: {
    type: String,
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
  wallet: {
    type: [
      {
        money: { type: Number },
        status: { type: String },
        date: { type: String },
        time: { type: String },
        orderId: { type: String },
      },
    ],
  },
  securityDelivery: {
    type: {
      idsIOrders: { type: [String], default: [] },
      money: {
        type: [
          {
            money: { type: Number },
            status: { type: String },
            date: { type: String },
            time: { type: String },
            orderId: { type: String },
            numberOrder: { type: Number },
          },
        ],
        default: [],
      },
      products: {
        type: [
          {
            idProduct: { type: String },
            nameProduct: { type: String },
            colorProduct: { type: String },
            sizeProduct: { type: String },
            priceProduct: { type: Number },
            gainMarkter: { type: Number },
            priceMarkter: { type: Number },
            priceCustomer: { type: Number },
            imageProduct: { type: String },
            storeProduct: { type: String },
            cityProduct: { type: String },
            amountProduct: { type: Number },
            orderId: { type: String },
            amountNewProduct: {
              type: Number,
              default: 0,
            },
          },
        ],
        default: [],
      },
    },
    default: { idsIOrders: [], money: [], products: [] },
  },
});

module.exports = mongoose.model("User", UserSchema);
