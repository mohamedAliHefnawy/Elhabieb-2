require("dotenv").config();
const CryptoJS = require("crypto-js");
const Pos = require("../models/pos");
const Products = require("../models/products");
const bcyrbt = require("bcrypt");

const keyHash = process.env.KEY_HASH;
const saltRounds = 10;

exports.GetPos = async (req, res) => {
  try {
    const pos = await Pos.find();

    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(pos),
      keyHash
    ).toString();

    res.json({ data: encryptedData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.GetPosById = async (req, res) => {
  try {
    const pos = await Pos.findById(req.params.id);

    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(pos),
      keyHash
    ).toString();

    res.json({ data: encryptedData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.GetOrdersPos = async (req, res) => {
  try {
    const pos = await Pos.findOne({ email: req.params.id });
    const orders = pos.orders;

    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(orders),
      keyHash
    ).toString();

    res.json({ data: encryptedData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.GetOrderPos = async (req, res) => {
  try {
    const emailPos = req.params.id.split("^")[1];
    const orderId = req.params.id.split("^")[0];

    const pos = await Pos.findOne({ email: emailPos });
    const order = pos.orders.find((order) => order.CodeInvoice == orderId);

    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(order),
      keyHash
    ).toString();

    res.json({ data: encryptedData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.GetMoneyPos = async (req, res) => {
  try {
    const pos = await Pos.findOne({ email: req.params.id });
    const money = pos.money;

    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(money),
      keyHash
    ).toString();

    res.json({ data: encryptedData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.AddPos = async (req, res) => {
  try {
    const { data: encryptedData } = req.body;
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, keyHash);
    const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
    const decryptedData = JSON.parse(decryptedText);

    const kasheer = await Pos.findOne({ email: decryptedData.name });
    if (kasheer) {
      return res.send("EXITED_SURE");
    }
    const hashedPassword = await bcyrbt.hash(
      decryptedData.password,
      saltRounds
    );

    const newPos = new Pos({
      email: decryptedData.name,
      phone: decryptedData.phone,
      phoneCompany: decryptedData.phoneCompany,
      colorCompany: decryptedData.colorkasheer,
      password: hashedPassword,
      image: decryptedData.img,
      city: decryptedData.selectedCity,
      store: decryptedData.selectedStore,
      moneysafe: decryptedData.selectedMoneyTreasury,
      validity: "Pos",
    });

    const SavePos = await newPos.save();
    if (SavePos) {
      res.status(200).send("ADDED_SUCCESS");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.EditPos = async (req, res) => {
  try {
    const { data: encryptedData } = req.body;
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, keyHash);
    const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
    const decryptedData = JSON.parse(decryptedText);

    const kasheer = await Pos.findOne({ email: decryptedData.name });

    const bcryptRegex = /^\$2[ayb]\$[0-9]{2}\$([./0-9A-Za-z]{53})$/;

    if (decryptedData.password && !bcryptRegex.test(decryptedData.password)) {
      const hashedPassword = await bcyrbt.hash(
        decryptedData.password,
        saltRounds
      );
      kasheer.password = hashedPassword;
    }

    kasheer.phone = decryptedData.phone;
    kasheer.phoneCompany = decryptedData.phoneCompany;
    kasheer.colorCompany = decryptedData.colorkasheer;
    kasheer.image = decryptedData.img;
    kasheer.city = decryptedData.selectedCity;
    kasheer.store = decryptedData.selectedStore;
    kasheer.moneysafe = decryptedData.selectedMoneyTreasury;

    const Save = await kasheer.save();
    if (Save) {
      res.status(200).send("EDITED_SUCCESS");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.NewInvoice = async (req, res) => {
  try {
    const { data: encryptedData } = req.body;
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, keyHash);
    const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
    const decryptedData = JSON.parse(decryptedText);

    const kasheer = await Pos.findOne({ email: decryptedData.namePos });
    const LastOrderNumber =
      kasheer.orders &&
      kasheer.orders.length > 0 &&
      kasheer.orders[kasheer.orders.length - 1].NumberInvoice;

    let newOrderNumber = 0;
    if (LastOrderNumber) {
      newOrderNumber = LastOrderNumber + 1;
    } else {
      newOrderNumber = 100;
    }

    for (const product of decryptedData.products) {
      const findProduct1 = await Products.findById(product._id);
      findProduct1.numberSelles += 1;

      if (findProduct1) {
        const findColor = findProduct1.details.find(
          (color) => color.color === product.color
        );

        const findSize = findColor.sizes.find(
          (size) =>
            size.size === product.size &&
            size.city === decryptedData.city &&
            size.store === decryptedData.store
        );

        findSize.amount -= product.amount;

        await findProduct1.save();
      } else {
        const findProduct2 = await Products.findOne({
          "products._id": product._id,
        });
        findProduct2.numberSelles += 1;

        const childProduct = findProduct2.products.find(
          (p) => p._id.toString() === product._id
        );

        const findColor = childProduct.details.find(
          (color) => color.color === product.color
        );

        const findSize = findColor.sizes.find(
          (size) =>
            size.size === product.size &&
            size.city === decryptedData.city &&
            size.store === decryptedData.store
        );

        findSize.amount -= product.amount;

        await findProduct2.save();
      }
    }

    kasheer.money.push({
      NumberInvoice: newOrderNumber,
      CodeInvoice: `${decryptedData.namePos[0]}-${newOrderNumber}`,
      discount: decryptedData.discount,
      totalPrice: decryptedData.totalPrice,
      totalPriceAfterDisount: decryptedData.totalPriceAfterDiscount,
      status: "InPos",
    });

    kasheer.orders.push({
      NumberInvoice: newOrderNumber,
      CodeInvoice: `${decryptedData.namePos[0]}-${newOrderNumber}`,
      namePos: decryptedData.namePos,
      imagePos: decryptedData.imagePos,
      phonePos: decryptedData.phonePos,
      phoneCompany: decryptedData.phoneCompany,
      colorCompany: decryptedData.colorCompany,
      moneyTreasury: decryptedData.moneyTreasury,
      city: decryptedData.city,
      store: decryptedData.store,
      totalPrice: decryptedData.totalPrice,
      totalPriceAfterDisount: decryptedData.totalPriceAfterDiscount,
      discount: decryptedData.discount,
      status: "InPos",
      products: decryptedData.products.map((item) => ({
        idproduct: item._id,
        nameProduct: item.name,
        imageProduct: item.image,
        colorProduct: item.color,
        sizeProduct: item.size,
        describtionProduct: item.describtion,
        priceProduct: item.price,
        amountProduct: item.amount,
        amountNewProduct: null,
      })),
    });

    const Save = await kasheer.save();
    if (Save) {
      res.status(200).send("SUCCESS");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
exports.EditVoice = async (req, res) => {
  try {
    const { data: encryptedData } = req.body;
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, keyHash);
    const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
    const decryptedData = JSON.parse(decryptedText);

    const kasheer = await Pos.findOne({ email: decryptedData.email });
    const order = kasheer.orders.find(
      (order) => order.CodeInvoice === decryptedData.slug
    );
    const money = kasheer.money.find(
      (money) => money.CodeInvoice === decryptedData.slug
    );

    if (decryptedData.selectedCase === "راجع كلي") {
      order.status = "ReturnedAll";
      money.status = "Failed";

      for (const product of order.products) {
        const findProduct1 = await Products.findById(product.idproduct);

        if (findProduct1) {
          const findColor = findProduct1.details.find(
            (color) => color.color === product.colorProduct
          );

          const findSize = findColor.sizes.find(
            (size) =>
              size.size === product.sizeProduct &&
              size.city === kasheer.city &&
              size.store === kasheer.store
          );

          findSize.amount += product.amountProduct;

          await findProduct1.save();
        } else {
          const findProduct2 = await Products.findOne({
            "products._id": product.idproduct,
          });

          const childProduct = findProduct2.products.find(
            (p) => p._id.toString() === product.idproduct
          );

          const findColor = childProduct.details.find(
            (color) => color.color === product.colorProduct
          );

          const findSize = findColor.sizes.find(
            (size) =>
              size.size === product.sizeProduct &&
              size.city === kasheer.city &&
              size.store === kasheer.store
          );

          findSize.amount += product.amountProduct;

          await findProduct2.save();
        }
      }
    } else if (decryptedData.selectedCase === "راجع جزئي") {
      order.status = "ReturnedPartial";
      const newTotalPrice = decryptedData.productChanges.reduce(
        (calc, alt) => calc + alt.newQuantity * alt.priceProduct,
        0
      );
      money.totalPrice = newTotalPrice;
      money.totalPriceAfterDisount =
        newTotalPrice - (newTotalPrice * money.discount) / 100;

      for (const product of decryptedData.productChanges) {
        order.products.find(
          (item) =>
            item.idproduct === product.productId &&
            item.colorProduct === product.colorProduct &&
            item.sizeProduct === product.sizeProduct
        ).amountNewProduct = product.newQuantity;

        const findProduct1 = await Products.findById(product.productId);

        if (findProduct1) {
          const findColor = findProduct1.details.find(
            (color) => color.color === product.colorProduct
          );

          const findSize = findColor.sizes.find(
            (size) =>
              size.size === product.sizeProduct &&
              size.city === decryptedData.city &&
              size.store === decryptedData.store
          );

          findSize.amount += product.oldQuantity - product.newQuantity;

          await findProduct1.save();
        } else {
          const findProduct2 = await Products.findOne({
            "products._id": product.productId,
          });

          const childProduct = findProduct2.products.find(
            (p) => p._id.toString() === product.productId
          );

          const findColor = childProduct.details.find(
            (color) => color.color === product.colorProduct
          );

          const findSize = findColor.sizes.find(
            (size) =>
              size.size === product.sizeProduct &&
              size.city === decryptedData.city &&
              size.store === decryptedData.store
          );

          findSize.amount += product.oldQuantity - product.newQuantity;

          await findProduct2.save();
        }
      }
    }

    const Save = await kasheer.save();
    if (Save) {
      res.status(200).send("SUCCESS");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
