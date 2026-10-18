require("dotenv").config();
const CryptoJS = require("crypto-js");
const Cities = require("../models/cities");

const keyHash = process.env.KEY_HASH;

exports.getStores = async (req, res) => {
  try {
    const item = await Cities.findById(req.params.id);

    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(item.stores),
      keyHash
    ).toString();
    res.json({ data: encryptedData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const item = await Cities.findById(req.params.id);
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(item),
      keyHash
    ).toString();
    res.json({ data: encryptedData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
