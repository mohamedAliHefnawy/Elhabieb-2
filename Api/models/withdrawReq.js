const mongoose = require("mongoose");

const WithdrawReqSchema = new mongoose.Schema({
  user: {
    type: String,
  },
  moneyTreasury: {
    type: String,
  },
  money: {
    type: [
      {
        money: { type: Number },
        orderId: { type: String },
        status: { type: String },
      },
    ],
  },
  phone: {
    type: String,
  },
  state: {
    type: String,
  },
  date: {
    type: String,
  },
  time: {
    type: String,
  },
});

module.exports = mongoose.model("WithdrawReq", WithdrawReqSchema);
