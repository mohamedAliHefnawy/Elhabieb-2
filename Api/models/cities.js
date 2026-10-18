const mongoose = require("mongoose");

const CitiesSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "",
    required: true,
  },
  character: {
    type: String,
    default: "",
    required: true,
  },
  prices: {
    type: [
      {
        name: { type: String },
        price: { type: Number },
      },
    ],
    default: [],
    required: true,
  },
  stores: {
    type: [
      {
        nameStore: { type: String },
        codeStore: { type: String },
        products: {
          type: [{}],
          default: [],
        },
      },
    ],
    default: [],
    required: true,
  },
});

module.exports = mongoose.model("cities", CitiesSchema);
