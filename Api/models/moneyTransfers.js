const mongoose = require("mongoose");

const MoneyTransfersSchema = new mongoose.Schema({
  namerSender: {
    type: String,
  },
  validitySender: {
    type: String,
  },
  date: {
    type: String,
  },
  time: {
    type: String,
  },
  money: {
    type: [
      {
        money: { type: Number },
        date: { type: String },
        time: { type: String },
        orderId: { type: String, default: "" },
        numberOrder: { type: Number, default: 0 },
        codeOrder: { type: String, default: "" },
      },
    ],
  },
});

module.exports = mongoose.model("MoneyTransfers", MoneyTransfersSchema);
