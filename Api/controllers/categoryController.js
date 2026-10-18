require("dotenv").config();
const CryptoJS = require("crypto-js");
const Categories = require("../models/categorey");

const keyHash = process.env.KEY_HASH;

exports.getCategories = async (req, res) => {
  try {
    const items = await Categories.find();

    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(items),
      keyHash
    ).toString();

    res.json({ data: encryptedData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCategory = async (req, res) => {
  try {
    const item = await Categories.findById(req.params.id);
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(item),
      keyHash
    ).toString();
    res.json({ data: encryptedData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addcategory = async (req, res) => {
  try {
    const { data: encryptedData } = req.body;

    const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, keyHash);
    const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
    const decryptedData = JSON.parse(decryptedText);

    const DataCatogry = {
      image: decryptedData.image,
      name: decryptedData.name,
      Active: decryptedData.isActive,
      dateAdded: new Date().toLocaleDateString(),
      timeAdded: new Date().toLocaleTimeString(),
      products: [],
    };

    const existingCategory = await Categories.findOne({
      name: DataCatogry.name,
    });

    if (existingCategory) {
      return res.send("EXIT_SURE");
    }

    const NewCatogry = new Categories(DataCatogry);
    const save = await NewCatogry.save();

    if (save) {
      return res.status(201).send("ADDED_SUSESS");
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.editCategory = async (req, res) => {
  try {
    const { data: encryptedData } = req.body;

    const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, keyHash);
    const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
    const decryptedData = JSON.parse(decryptedText);

    const { name, isActive, image } = decryptedData;

    const existingCategoryByName = await Categories.findOne({ name });

    if (
      existingCategoryByName &&
      existingCategoryByName._id.toString() !== req.params.id
    ) {
      return res.status(200).send("CATEGORY_NAME_EXISTS");
    }

    const existingCategory = await Categories.findById(req.params.id);

    if (!existingCategory) {
      return res.status(404).send("CATEGORY_NOT_FOUND");
    }

    existingCategory.name = name;
    existingCategory.Active = isActive;
    existingCategory.image = image;

    const updatedCategory = await existingCategory.save();

    if (updatedCategory) {
      return res.status(200).send("EDIT_SUCCESS");
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
