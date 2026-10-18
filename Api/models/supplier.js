const mongoose = require("mongoose");

const SupplierSchema = new mongoose.Schema({
  image: {
    type: String,
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  dateAdded: {
    type: String,
  },
  timeAdded: {
    type: String,
  },
});

module.exports = mongoose.model("Supplier", SupplierSchema);
