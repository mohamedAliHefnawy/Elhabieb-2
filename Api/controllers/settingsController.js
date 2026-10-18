require("dotenv").config();
const CryptoJS = require("crypto-js");

const Settings = require("../models/settings");

const keyHash = process.env.KEY_HASH;

exports.GetSettings = async (req, res) => {
  try {
    const items = await Settings.find();

    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(items[0]),
      keyHash
    ).toString();

    res.json({ data: encryptedData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.EditSettings = async (req, res) => {
  try {
    const { data: encryptedData } = req.body;

    const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, keyHash);
    const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
    const decryptedData = JSON.parse(decryptedText);

    const updateSettings = await Settings.findOne();
    if (!updateSettings) {
      const newSettings = new Settings({
        colors: {
          navBarColor: decryptedData.navBarColor,
          sideBarColor: decryptedData.sideBarColor,
          bodyColor: decryptedData.bodyColor,
        },
      });

      await newSettings.save();
      return res.status(201).send("SUCCESS");
    }
    updateSettings.colors.navBarColor = decryptedData.navBarColor;
    updateSettings.colors.sideBarColor = decryptedData.sideBarColor;
    updateSettings.colors.bodyColor = decryptedData.bodyColor;

    const save = await updateSettings.save();
    if (save) {
      return res.status(201).send("SUCCESS");
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.EditImages = async (req, res) => {
  try {
    const { data: encryptedData } = req.body;

    const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, keyHash);
    const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
    const decryptedData = JSON.parse(decryptedText);

    const updateImagesSettings = await Settings.findOne();

    if (!updateImagesSettings) {
      const newSettings = new Settings({
        mat3ger: { images: decryptedData.images },
      });

      await newSettings.save();
      return res.status(201).send("SUCCESS");
    }
    updateImagesSettings.mat3ger.images = decryptedData.images;

    const save = await updateImagesSettings.save();
    if (save) {
      return res.status(201).send("SUCCESS");
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
