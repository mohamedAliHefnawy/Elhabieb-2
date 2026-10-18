const mongoose = require("mongoose");

const PurchasesSchema = new mongoose.Schema({
  supplier: {
    type: String,
    default: "",
  },
  moneyTreasury: {
    type: String,
    default: "",
  },
  city: {
    type: String,
    default: "",
  },
  store: {
    type: String,
    default: "",
  },
  totalValuePurchase: {
    type: Number,
    default: "",
  },
  paymentMoneyDetails: {
    type: [
      {
        valueMoney: { type: Number },
        employ: { type: String },
        date: { type: String },
        time: { type: String },
      },
    ],
    default: [],
  },

  date: {
    type: String,
    default: "",
  },

  time: {
    type: String,
    default: "",
  },

  productData: {
    type: [
      {
        id: { type: String },
        color: { type: String },
        size: { type: String },
        amount: { type: String },
        price: { type: String },
      },
    ],
    default: [],
  },
});

module.exports = mongoose.model("purchases", PurchasesSchema);
