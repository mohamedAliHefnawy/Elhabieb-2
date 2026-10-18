const mongoose = require("mongoose");

const MoneyTreasuriesSchema = new mongoose.Schema({
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
  money: {
    type: [
      {
        valueMoney: { type: Number },
        date: { type: String },
        time: { type: String },
        person: { type: String },
        note: { type: String }
      },
    ],
  },
  dateAdded: {
    type: String,
  },
  timeAdded: {
    type: String,
  },
});

module.exports = mongoose.model("MoneyTreasuries", MoneyTreasuriesSchema);
