const mongoose = require("mongoose");

const SettingsSchema = new mongoose.Schema({
  colors: {
    type: {
      navBarColor: { type: String },
      sideBarColor: { type: String },
      bodyColor: { type: String },
    },
  },
  mat3ger: {
    images: { type: [String] },
  },
});

module.exports = mongoose.model("Settings", SettingsSchema);
