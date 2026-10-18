const { Schema, model } = require("mongoose");

const Pos = new Schema({
  email: {
    type: String,
  },
  image: {
    type: String,
  },
  phone: {
    type: String,
  },
  validity: {
    type: String,
  },
  phoneCompany: {
    type: String,
  },
  colorCompany: {
    type: String,
  },
  password: {
    type: String,
  },
  city: {
    type: String,
  },
  store: {
    type: String,
  },
  moneysafe: {
    type: String,
  },
  orders: {
    type: [
      {
        products: {
          type: [
            {
              idproduct: { type: String },
              nameProduct: { type: String },
              imageProduct: { type: String },
              colorProduct: { type: String },
              sizeProduct: { type: String },
              describtionProduct: { type: String },
              priceProduct: { type: Number },
              amountProduct: { type: Number },
              amountNewProduct: { type: Number },
            },
          ],
        },
        NumberInvoice: { type: Number },
        CodeInvoice: { type: String },
        namePos: { type: String },
        imagePos: { type: String },
        phonePos: { type: String },
        phoneCompany: { type: String },
        colorCompany: { type: String },
        moneyTreasury: { type: String },
        city: { type: String },
        store: { type: String },
        totalPrice: { type: Number },
        totalPriceAfterDisount: { type: Number },
        discount: { type: Number },
        status: { type: String },
        dateInvoice: {
          type: String,
          default: () => new Date().toLocaleDateString(),
        },
        timeInvoice: {
          type: String,
          default: () => new Date().toLocaleTimeString(),
        },
      },
    ],
    default: [],
  },
  money: {
    type: [
      {
        NumberInvoice: { type: Number },
        CodeInvoice: { type: String },
        discount: { type: Number },
        totalPrice: { type: Number },
        totalPriceAfterDisount: { type: Number },
        date: { type: String, default: () => new Date().toLocaleDateString() },
        time: { type: String, default: () => new Date().toLocaleTimeString() },
        status: { type: String },
      },
    ],
    default: [],
  },
  convertedMoney: {
    type: [
      {
        products: {
          type: [
            {
              nameProduct: { type: String },
              sizeProduct: { type: String },
              amountProduct: { type: Number },
              priceProduct: { type: Number },
              returned: { type: Boolean },
            },
          ],
        },
        totalPrice: { type: Number },
        deduct: { type: Number },
        dateInvoice: { type: String },
        timeInvoice: { type: String },
        NumberInvoice: { type: Number },
        CodeInvoice: { type: String },
        money: { type: Number },
        notes: { type: String },
        dateConverted: { type: String },
        timeConverted: { type: String },
      },
    ],
    default: [],
  },
});

const PosModel = model("Pos", Pos);
module.exports = PosModel;
