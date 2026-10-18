require("dotenv").config();
const CryptoJS = require("crypto-js");
const Order = require("../models/order");
const Cart = require("../models/cart");
const Products = require("../models/products");
const Users = require("../models/user");
const MoneyTreasury = require("../models/moneyTreasury");

const keyHash = process.env.KEY_HASH;

exports.getOrders = async (req, res) => {
  try {
    const items = await Order.find();

    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(items),
      keyHash
    ).toString();
    res.json({ data: encryptedData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(order),
      keyHash
    ).toString();
    res.json({ data: encryptedData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.ChatOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    const chatOrder = order.chat;

    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(chatOrder),
      keyHash
    ).toString();
    res.json({ data: encryptedData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getOrderUser = async (req, res) => {
  try {
    const AllOrders = await Order.find();

    const OrdersUser = AllOrders.filter(
      (item) => item.markter === req.params.id
    );
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(OrdersUser),
      keyHash
    ).toString();
    res.json({ data: encryptedData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addOrder = async (req, res) => {
  try {
    const { data: encryptedData } = req.body;

    const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, keyHash);
    const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
    const decryptedData = JSON.parse(decryptedText);

    const user = await Users.findOne({ email: decryptedData.markter });
    const orders = await Order.find();

    for (const product of decryptedData.products) {
      const findProduct1 = await Products.findById(product.idProduct);
      findProduct1.numberSelles += 1;

      if (findProduct1) {
        const findColor = findProduct1.details.find(
          (color) => color.color === product.colorProduct
        );

        const findSize = findColor.sizes.find(
          (size) =>
            size.size === product.sizeProduct &&
            size.city === product.cityProduct &&
            size.store === product.storeProduct
        );

        findSize.amount -= product.amountProduct;

        await findProduct1.save();
      } else {
        const findProduct2 = await Products.findOne({
          "products._id": product.idProduct,
        });
        findProduct2.numberSelles += 1;

        const childProduct = findProduct2.products.find(
          (p) => p._id.toString() === product.idProduct
        );

        const findColor = childProduct.details.find(
          (color) => color.color === product.colorProduct
        );

        const findSize = findColor.sizes.find(
          (size) =>
            size.size === product.sizeProduct &&
            size.city === product.cityProduct &&
            size.store === product.storeProduct
        );

        findSize.amount -= product.amountProduct;

        await findProduct2.save();
      }
    }

    const cart = await Cart.findOne({ user: decryptedData.markter });

    cart.products = [];
    let numerOrder;
    if (orders.length === 0) {
      numerOrder = 100;
    } else {
      numerOrder = orders[orders.length - 1].numerOrder + 1;
    }

    const NewOrder = new Order({
      ...decryptedData,
      numerOrder,
      company: decryptedData.company || {},
    });
    const saveOrder = await NewOrder.save();

    const saveCart = await cart.save();

    if ((saveOrder, saveCart)) {
      if (user.validity === "Markter") {
        user.wallet.push({
          money: decryptedData.gainMarkter,
          status: "Waiting",
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString(),
          orderId: saveOrder._id,
        });
      }
      await user.save();
      return res.status(201).send("ADDED_SUSESS");
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.EditOrder = async (req, res) => {
  try {
    const { data: encryptedData } = req.body;

    const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, keyHash);
    const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
    const decryptedData = JSON.parse(decryptedText);

    const order = await Order.findById(decryptedData.orderId);

    const user = await Users.findOne({ email: order.markter });
    const moneyTreasury = await MoneyTreasury.findOne({
      name: decryptedData.moneyTreasury,
    });

    if (
      decryptedData.casesOrder[decryptedData.casesOrder.length - 1].case ===
      "تم الرفض"
    ) {
      for (const product of order.products) {
        const findProduct1 = await Products.findById(product.idProduct);

        if (findProduct1) {
          const findColor = findProduct1.details.find(
            (color) => color.color === product.colorProduct
          );

          const findSize = findColor.sizes.find(
            (size) =>
              size.size === product.sizeProduct &&
              size.city === product.cityProduct &&
              size.store === product.storeProduct
          );

          findSize.amount += product.amountProduct;

          await findProduct1.save();
        } else {
          const findProduct2 = await Products.findOne({
            "products._id": product.idProduct,
          });

          const childProduct = findProduct2.products.find(
            (p) => p._id.toString() === product.idProduct
          );

          const findColor = childProduct.details.find(
            (color) => color.color === product.colorProduct
          );

          const findSize = findColor.sizes.find(
            (size) =>
              size.size === product.sizeProduct &&
              size.city === product.cityProduct &&
              size.store === product.storeProduct
          );

          findSize.amount += product.amountProduct;

          await findProduct2.save();
        }
      }

      if (user.validity === "Markter") {
        user.wallet.find(
          (item) => item.orderId === decryptedData.orderId
        ).status = "Failed";
      }
    } else if (
      decryptedData.casesOrder[decryptedData.casesOrder.length - 1].case ===
      "تم إستلام الكاش"
    ) {
      moneyTreasury.money.push({
        valueMoney: order.priceProducts,
        note: `فلوس طلبية ${order._id} من المستخدم ${order.markter}`,
        person: "محمد علي",
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
      });

      if (user.validity === "Markter") {
        user.wallet.find(
          (item) => item.orderId === decryptedData.orderId
        ).status = "PayAble";
      }
    } else if (
      decryptedData.casesOrder[decryptedData.casesOrder.length - 1].case ===
      "تم الإسترجاع"
    ) {
      if (user.validity === "Markter") {
        user.wallet.find(
          (item) => item.orderId === decryptedData.orderId
        ).status = "Failed";
      }

      for (const product of order.products) {
        product.amountNewProduct = product.amountProduct;
        const findProduct1 = await Products.findById(product.idProduct);
        if (findProduct1) {
          const findColor = findProduct1.details.find(
            (color) => color.color === product.colorProduct
          );

          const findSize = findColor.sizes.find(
            (size) =>
              size.size === product.sizeProduct &&
              size.city === product.cityProduct &&
              size.store === product.storeProduct
          );

          findSize.amount += product.amountProduct;

          await findProduct1.save();
        } else {
          const findProduct2 = await Products.findOne({
            "products._id": product.idProduct,
          });

          const childProduct = findProduct2.products.find(
            (p) => p._id.toString() === product.idProduct
          );

          const findColor = childProduct.details.find(
            (color) => color.color === product.colorProduct
          );

          const findSize = findColor.sizes.find(
            (size) =>
              size.size === product.sizeProduct &&
              size.city === product.cityProduct &&
              size.store === product.storeProduct
          );

          findSize.amount += product.amountProduct;

          await findProduct2.save();
        }
        await order.save();
      }
    } else if (decryptedData.casesOrder[0].case === "إسترجاع جزئي") {
      for (const product of decryptedData.productChanges) {
        const findOrderProduct = order.products.find(
          (item) =>
            item.idProduct === product.productId &&
            item.sizeProduct === product.sizeProduct &&
            item.colorProduct === product.colorProduct
        );

        findOrderProduct.amountNewProduct =
          product.oldQuantity - product.newQuantity;

        await order.save();

        const findProduct1 = await Products.findById(product.productId);
        if (findProduct1) {
          const findColor = findProduct1.details.find(
            (color) => color.color === product.colorProduct
          );
          const findSize = findColor.sizes.find(
            (size) =>
              size.size === product.sizeProduct &&
              size.city === product.cityProduct &&
              size.store === product.storeProduct
          );
          findSize.amount += product.oldQuantity - product.newQuantity;
          await findProduct1.save();
        } else {
          const findProduct2 = await Products.findOne({
            "products._id": product.idProduct,
          });
          const childProduct = findProduct2.products.find(
            (p) => p._id.toString() === product.idProduct
          );
          const findColor = childProduct.details.find(
            (color) => color.color === product.colorProduct
          );
          const findSize = findColor.sizes.find(
            (size) =>
              size.size === product.sizeProduct &&
              size.city === product.cityProduct &&
              size.store === product.storeProduct
          );
          findSize.amount += product.oldQuantity - product.newQuantity;
          await findProduct2.save();
        }
      }

      const totalNewGain = decryptedData.productChanges.reduce(
        (sum, product) => sum + product.newGain,
        0
      );

      const totalPriceNew = decryptedData.productChanges.reduce(
        (sum, product) => sum + product.totalPriceNew,
        0
      );

      if (user.validity === "Markter") {
        user.wallet.find(
          (item) => item.orderId === decryptedData.orderId
        ).money = totalNewGain;
      }

      moneyTreasury.money.push({
        valueMoney: totalPriceNew,
        note: `فلوس طلبية ${order._id} من المستخدم ${order.markter}`,
        person: "محمد علي",
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
      });
    }

    order.casesOrder = decryptedData.casesOrder;
    const saveOrder = await order.save();
    const saveUser = await user.save();
    const saveMoneyTreasury = await moneyTreasury.save();

    if (saveOrder && saveUser && saveMoneyTreasury) {
      return res.status(201).send("SAVE_SUSESS");
    }
  } catch (err) {
    return res.status(201).send("FALIED");
  }
};

exports.Chat = async (req, res) => {
  try {
    const { data: encryptedData } = req.body;

    const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, keyHash);
    const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
    const decryptedData = JSON.parse(decryptedText);

    const order = await Order.findById(decryptedData.idOrder);
    order.chat.push({
      message: decryptedData.message,
      nameSender: decryptedData.nameSender,
      vaildity: decryptedData.vaildity,
      date: decryptedData.date,
      time: decryptedData.time,
      showUser:
        decryptedData.vaildity === "Markter" ||
        decryptedData.vaildity === "Client"
          ? true
          : false,
      showAdmin: decryptedData.vaildity === "Admin" ? true : false,
      showEmploy: decryptedData.vaildity === "Employ" ? true : false,
      showDelivery: decryptedData.vaildity === "Delivery" ? true : false,
    });

    const SaveOrder = await order.save();
    if (SaveOrder) {
      return res.status(201).send("SUSESS");
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.EditChat = async (req, res) => {
  try {
    const { data: encryptedData } = req.body;

    const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, keyHash);
    const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
    const decryptedData = JSON.parse(decryptedText);

    const order = await Order.findById(decryptedData.idOrder);
    const role = decryptedData.vaildity;

    order.chat.forEach((item) => {
      switch (role) {
        case "Admin":
          item.showAdmin = true;
          break;
        case "Employ":
          item.showEmploy = true;
          break;
        case "Delivery":
          item.showDelivery = true;
          break;
        case "Markter":
        case "Client":
          item.showUser = true;
          break;
        default:
          break;
      }
    });

    await order.save();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
