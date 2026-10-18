require("dotenv").config();
const CryptoJS = require("crypto-js");
const Suppliers = require("../models/supplier");
const Purchases = require("../models/purchases");

const keyHash = process.env.KEY_HASH;

exports.getSuppliers = async (req, res) => {
  try {
    const items = await Suppliers.find();

    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(items),
      keyHash
    ).toString();

    res.json({ data: encryptedData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getSupplier = async (req, res) => {
  try {
    const item = await Suppliers.findById(req.params.id);
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(item),
      keyHash
    ).toString();
    res.json({ data: encryptedData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getInvoices = async (req, res) => {
  try {
    const item = await Suppliers.findById(req.params.id);
    
    const invoices = await Purchases.find({ supplier: item.name });

    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(invoices),
      keyHash
    ).toString();

    res.json({ data: encryptedData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addSupplier = async (req, res) => {
  try {
    const { data: encryptedData } = req.body;

    const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, keyHash);
    const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
    const decryptedData = JSON.parse(decryptedText);

    const DataSupplier = {
      image: decryptedData.image,
      name: decryptedData.name,
      phone: decryptedData.phone,
      dateAdded: new Date().toLocaleDateString(),
      timeAdded: new Date().toLocaleTimeString(),
    };

    const existingSupplier = await Suppliers.findOne({
      name: DataSupplier.name,
    });

    if (existingSupplier) {
      return res.send("EXIT_SURE");
    }

    const NewSupplier = new Suppliers(DataSupplier);
    const save = await NewSupplier.save();

    if (save) {
      return res.status(201).send("ADDED_SUSESS");
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.editSupplier = async (req, res) => {
  try {
    const { data: encryptedData } = req.body;

    const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, keyHash);
    const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
    const decryptedData = JSON.parse(decryptedText);

    const { name, image, phone } = decryptedData;

    const existingSupplierByName = await Suppliers.findOne({ name });

    if (
      existingSupplierByName &&
      existingSupplierByName._id.toString() !== req.params.id
    ) {
      return res.status(200).send("Supplier_NAME_EXISTS");
    }

    const existingSupplier = await Suppliers.findById(req.params.id);

    if (!existingSupplier) {
      return res.status(404).send("Supplier_NOT_FOUND");
    }

    existingSupplier.name = name;
    existingSupplier.phone = phone;
    existingSupplier.image = image;

    const updatedSupplier = await existingSupplier.save();

    if (updatedSupplier) {
      return res.status(200).send("EDIT_SUCCESS");
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
