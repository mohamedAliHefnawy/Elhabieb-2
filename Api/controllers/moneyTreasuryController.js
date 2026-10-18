require("dotenv").config();
const CryptoJS = require("crypto-js");
const MoneyTreasury = require("../models/moneyTreasury");

const keyHash = process.env.KEY_HASH;

exports.getMoneyTreasuries = async (req, res) => {
  try {
    const items = await MoneyTreasury.find();

    
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(items),
      keyHash
    ).toString();
    
    res.json({ data: encryptedData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMoneyTreasury = async (req, res) => {
  try {
    const item = await MoneyTreasury.findById(req.params.id);
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(item),
      keyHash
    ).toString();
    res.json({ data: encryptedData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addMoneyTreasury = async (req, res) => {
  try {
    const { data: encryptedData } = req.body;

    const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, keyHash);
    const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
    const decryptedData = JSON.parse(decryptedText);

    const DataCatogry = {
      name: decryptedData.name,
      image: decryptedData.image,
      Active: decryptedData.Active,
      dateAdded: decryptedData.dateAdded,
      timeAdded: decryptedData.timeAdded,
      money: [],
    };

    const existingMoneyTreasury = await MoneyTreasury.findOne({
      name: DataCatogry.name,
    });

    if (existingMoneyTreasury) {
      return res.send("EXIT_SURE");
    }

    const NewMoneyTreasury = new MoneyTreasury(DataCatogry);
    const save = await NewMoneyTreasury.save();

    if (save) {
      return res.status(201).send("ADDED_SUSESS");
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.editMoneyTreasury = async (req, res) => {
  try {
    const { data: encryptedData } = req.body;

    const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, keyHash);
    const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
    const decryptedData = JSON.parse(decryptedText);

    const { name, Active, image } = decryptedData;

    const existingMoneyTreasuryByName = await MoneyTreasury.findOne({ name });

    if (
      existingMoneyTreasuryByName &&
      existingMoneyTreasuryByName._id.toString() !== req.params.id
    ) {
      return res.status(200).send("MONEYTREASURY_NAME_EXISTS");
    }

    const existingMoneyTreasury = await MoneyTreasury.findById(req.params.id);

    if (!existingMoneyTreasury) {
      return res.status(404).send("MONEYTREASURY_NOT_FOUND");
    }

    existingMoneyTreasury.name = name;
    existingMoneyTreasury.Active = Active;
    existingMoneyTreasury.image = image;

    const updatedMoneyTreasury = await existingMoneyTreasury.save();

    if (updatedMoneyTreasury) {
      return res.status(200).send("EDIT_SUCCESS");
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.addMoneyToMoneyTreasury = async (req, res) => {
  try {
    const { data: encryptedData } = req.body;

    const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, keyHash);
    const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
    const decryptedData = JSON.parse(decryptedText);

    const { id, valueMoney, note, person, date, time } = decryptedData;

    const existingMoneyTreasury = await MoneyTreasury.findById(id);

    if (!existingMoneyTreasury) {
      return res.status(404).send("MONEYTREASURY_NOT_FOUND");
    }

    existingMoneyTreasury.money.push({
      valueMoney,
      note,
      person,
      date,
      time,
    });

    const updatedMoneyTreasury = await existingMoneyTreasury.save();

    if (updatedMoneyTreasury) {
      return res.status(200).send("ADDEDD_MONEY_SUCCESS");
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
