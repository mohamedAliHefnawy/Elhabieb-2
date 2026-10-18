require("dotenv").config();
const mongoose = require("mongoose");
const CryptoJS = require("crypto-js");
const Orders = require("../models/order");
const Users = require("../models/user");
const Products = require("../models/products");

const keyHash = process.env.KEY_HASH;

exports.getPhoneDelivery = async (req, res) => {
  try {
    const email = req.params.id;
    const user = await Users.findOne({ email });

    res.json({ data: user.phone });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getWalletDelivery = async (req, res) => {
  try {
    const identifier = req.params.id;
    let user;

    if (identifier.includes("@")) {
      user = await Users.findOne({ email: identifier });
    } else if (mongoose.Types.ObjectId.isValid(identifier)) {
      user = await Users.findById(identifier);
    } else {
      return res.status(400).json({ message: "Invalid identifier format" });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(user.securityDelivery.money),
      keyHash
    ).toString();

    res.json({ data: encryptedData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProductsDelivery = async (req, res) => {
  try {
    const identifier = req.params.id;
    let user;

    if (identifier.includes("@")) {
      user = await Users.findOne({ email: identifier });
    } else if (mongoose.Types.ObjectId.isValid(identifier)) {
      user = await Users.findById(identifier);
    } else {
      return res.status(400).json({ message: "Invalid identifier format" });
    }

    let products = [];

    for (const product of user.securityDelivery.products) {
      const order = await Orders.findById(product.orderId);
      if (
        order.casesOrder[order.casesOrder.length - 1].case === "تم الإسترجاع" ||
        order.casesOrder[order.casesOrder.length - 1].case === "إسترجاع جزئي"
      ) {
        products.push({
          idProduct: product.idProduct,
          nameProduct: product.nameProduct,
          colorProduct: product.colorProduct,
          sizeProduct: product.sizeProduct,
          priceProduct: product.priceProduct,
          gainMarkter: product.gainMarkter,
          priceMarkter: product.priceMarkter,
          priceCustomer: product.priceCustomer,
          imageProduct: product.imageProduct,
          storeProduct: product.storeProduct,
          cityProduct: product.cityProduct,
          amountProduct: product.amountProduct,
          amountNewProduct: product.amountNewProduct,
          orderId: product.orderId,
          validity: order.vaildity,
        });
      }
    }

    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(products),
      keyHash
    ).toString();
    res.json({ data: encryptedData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllDataDelivery = async (req, res) => {
  try {
    const user = await Users.findById(req.params.id);

    let products = [];
    let productsWithOrderWaiting = [];

    for (const product of user.securityDelivery.products) {
      const order = await Orders.findById(product.orderId);
      if (
        order.casesOrder[order.casesOrder.length - 1].case === "تم الإسترجاع" ||
        order.casesOrder[order.casesOrder.length - 1].case === "إسترجاع جزئي"
      ) {
        products.push({
          idProduct: product.idProduct,
          nameProduct: product.nameProduct,
          colorProduct: product.colorProduct,
          sizeProduct: product.sizeProduct,
          priceProduct: product.priceProduct,
          gainMarkter: product.gainMarkter,
          priceMarkter: product.priceMarkter,
          priceCustomer: product.priceCustomer,
          imageProduct: product.imageProduct,
          storeProduct: product.storeProduct,
          cityProduct: product.cityProduct,
          amountProduct: product.amountProduct,
          amountNewProduct: product.amountNewProduct,
          orderId: product.orderId,
          validity: order.vaildity,
        });
      } else if (
        order.casesOrder[order.casesOrder.length - 1].case === "مع الشحن"
      ) {
        productsWithOrderWaiting.push({
          idProduct: product.idProduct,
          nameProduct: product.nameProduct,
          colorProduct: product.colorProduct,
          sizeProduct: product.sizeProduct,
          priceProduct: product.priceProduct,
          gainMarkter: product.gainMarkter,
          priceMarkter: product.priceMarkter,
          priceCustomer: product.priceCustomer,
          imageProduct: product.imageProduct,
          storeProduct: product.storeProduct,
          cityProduct: product.cityProduct,
          amountProduct: product.amountProduct,
          amountNewProduct: product.amountNewProduct,
          orderId: product.orderId,
          validity: order.vaildity,
        });
      }
    }

    const DataUser = {
      money: user.securityDelivery.money,
      productsReturnedAndPartial: products,
      productsWithOrderWaiting: productsWithOrderWaiting,
    };

    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(DataUser),
      keyHash
    ).toString();
    res.json({ data: encryptedData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getOrdersToDelivery = async (req, res) => {
  try {
    const { data: encryptedData } = req.body;

    const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, keyHash);
    const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
    const decryptedData = JSON.parse(decryptedText);

    const { dataReq, numberOrdersReq, delivery } = decryptedData;

    const user = await Users.findOne({ email: delivery });
    if (!user || !user.securityDelivery.idsIOrders) {
      throw new Error("User or delivery order IDs not found");
    }

    if (numberOrdersReq === 0) {
      const items = await Orders.find({
        _id: { $in: user.securityDelivery.idsIOrders },
      })
        .sort({ numerOrder: -1 })
        .select(dataReq.join(" "));

      const encryptedDataRes = CryptoJS.AES.encrypt(
        JSON.stringify(items),
        keyHash
      ).toString();

      res.json({ data: encryptedDataRes });
    } else {
      const items = await Orders.find({
        _id: { $in: user.securityDelivery.idsIOrders },
      })
        .sort({ numerOrder: -1 })
        .limit(numberOrdersReq)
        .select(dataReq.join(" "));

      const encryptedDataRes = CryptoJS.AES.encrypt(
        JSON.stringify(items),
        keyHash
      ).toString();

      res.json({ data: encryptedDataRes });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getOrderToDelivery = async (req, res) => {
  try {
    const { data: encryptedData } = req.body;

    const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, keyHash);
    const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
    const decryptedData = JSON.parse(decryptedText);

    const { dataReq, slug } = decryptedData;

    const order = await Orders.find({
      _id: slug,
    }).select(dataReq.join(" "));

    const encryptedDataRes = CryptoJS.AES.encrypt(
      JSON.stringify(order),
      keyHash
    ).toString();

    res.json({ data: encryptedDataRes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.Scanner = async (req, res) => {
  try {
    const { data: encryptedData } = req.body;

    const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, keyHash);
    const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
    const decryptedData = JSON.parse(decryptedText);

    const { deliveryEmail, idOrder } = decryptedData;

    const order = await Orders.findById(idOrder);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.delivery !== "") {
      return res.status(200).send("ORDER_EXITED");
    }

    const restrictedCases = [
      "تم الرفض",
      "تم التوصيل",
      "تم الإسترجاع",
      "إسترجاع جزئي",
      "تم إستلام الكاش",
    ];
    if (order.casesOrder.some((item) => restrictedCases.includes(item.case))) {
      return res.status(200).send("NOT_VALID_ORDER");
    }

    order.delivery = deliveryEmail;
    order.casesOrder.push({
      case: "مع الشحن",
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
    });

    const user = await Users.findOne({ email: deliveryEmail });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.securityDelivery.idsIOrders.includes(idOrder)) {
      return res.status(200).send("ORDER_ALREADY_ADDED");
    }

    user.securityDelivery.idsIOrders.push(idOrder);
    user.securityDelivery.money.push({
      money: order.priceProducts,
      status: "أموال متوقعة",
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      orderId: idOrder,
      numberOrder: order.numerOrder,
    });

    order.products.forEach((item) => {
      user.securityDelivery.products.push({
        idProduct: item.idProduct || "",
        nameProduct: item.nameProduct || "",
        colorProduct: item.colorProduct || "",
        sizeProduct: item.sizeProduct || "",
        priceProduct: item.priceProduct || 0,
        gainMarkter: item.gainMarkter || 0,
        priceMarkter: item.priceMarkter || 0,
        priceCustomer: item.priceCustomer || 0,
        imageProduct: item.imageProduct || "",
        storeProduct: item.storeProduct || "",
        cityProduct: item.cityProduct || "",
        amountProduct: item.amountProduct || 0,
        amountNewProduct: null,
        orderId: idOrder,
      });
    });

    const SaveUser = await user.save();
    const SaveOrder = await order.save();

    if (SaveUser && SaveOrder) {
      return res.status(200).send("SUCCESS");
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.EditCaseOrder = async (req, res) => {
  try {
    const { data: encryptedData } = req.body;

    const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, keyHash);
    const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
    const decryptedData = JSON.parse(decryptedText);

    const { idOrder, delivery, selectedCase, productChanges } = decryptedData;

    const order = await Orders.findById(idOrder);
    const user = await Users.findOne({ email: delivery });
    const markter = await Users.findOne({ email: order.markter });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (selectedCase === "تم التوصيل") {
      order.casesOrder.push({
        case: selectedCase,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
      });
      user.securityDelivery.money.find(
        (item) => item.orderId === idOrder
      ).status = "أموال قابلة للتحويل";
      const filterProducts = user.securityDelivery.products.filter(
        (item) => item.orderId.toString() !== idOrder.toString()
      );

      user.securityDelivery.products = filterProducts;

      const SaveUser = await user.save();
      const SaveOrder = await order.save();

      if (SaveUser && SaveOrder) {
        return res.status(200).send("SUCCESS");
      }
    } else if (selectedCase === "تم الإسترجاع") {
      order.casesOrder.push({
        case: selectedCase,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
      });

      for (const item of order.products) {
        item.amountNewProduct = item.amountProduct;
        for (const item2 of user.securityDelivery.products) {
          if (item2.orderId === idOrder) {
            item2.amountNewProduct = item2.amountProduct;
          }
          await user.save();
        }
        await order.save();
      }

      if (markter.validity === "Markter") {
        markter.wallet.find((item) => item.orderId === idOrder).status =
          "Failed";
      }

      user.securityDelivery.money.find(
        (item) => item.orderId === idOrder
      ).status = "أموال فاشلة";

      const SaveUser = await user.save();
      const SaveMarkter = await markter.save();
      const SaveOrder = await order.save();

      if (SaveUser && SaveOrder && SaveMarkter) {
        return res.status(200).send("SUCCESS");
      }
    } else if (selectedCase === "إسترجاع جزئي") {
      order.casesOrder.push({
        case: selectedCase,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
      });
      const saveOrder = await order.save();

      for (const product of productChanges) {
        const findOrderProduct = order.products.find(
          (item) =>
            item.idProduct === product.productId &&
            item.sizeProduct === product.sizeProduct &&
            item.colorProduct === product.colorProduct
        );

        const findProduct = user.securityDelivery.products.find(
          (item) =>
            item.orderId.toString() === idOrder.toString() &&
            item.idProduct === product.productId &&
            item.sizeProduct === product.sizeProduct &&
            item.colorProduct === product.colorProduct
        );

        findOrderProduct.amountNewProduct =
          product.oldQuantity - product.newQuantity;

        if (product.oldQuantity === product.newQuantity) {
          user.securityDelivery.products =
            user.securityDelivery.products.filter(
              (item) =>
                !(
                  item.orderId.toString() === idOrder.toString() &&
                  item.idProduct === product.productId &&
                  item.sizeProduct === product.sizeProduct &&
                  item.colorProduct === product.colorProduct
                )
            );
        } else {
          findProduct.amountNewProduct =
            product.oldQuantity - product.newQuantity;
        }

        await user.save();
        await order.save();
      }

      const totalNewGain = decryptedData.productChanges.reduce(
        (sum, product) => sum + product.newGain,
        0
      );

      const totalPriceNew = decryptedData.productChanges.reduce(
        (sum, product) => sum + product.totalPriceNew,
        0
      );

      if (markter.validity === "Markter") {
        markter.wallet.find((item) => item.orderId === idOrder).money =
          totalNewGain;
      }

      user.securityDelivery.money.find(
        (item) => item.orderId === idOrder
      ).money = totalPriceNew;

      user.securityDelivery.money.find(
        (item) => item.orderId === idOrder
      ).status = "أموال قابلة للتحويل";

      const saveUser = await user.save();
      const SaveMarkter = await markter.save();

      if (saveOrder && saveUser && SaveMarkter) {
        return res.status(201).send("SAVE_SUSESS");
      }
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.ReturnProductsToStore = async (req, res) => {
  try {
    const { data: encryptedData } = req.body;

    // فك تشفير البيانات
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, keyHash);
    const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
    const decryptedData = JSON.parse(decryptedText);

    const { selectedCity, selectedStore, quantities, idDelivery } =
      decryptedData;

    const user = await Users.findById(idDelivery);

    for (const product of quantities) {
      const findProductsInDeliveryStore = user.securityDelivery.products.filter(
        (item) =>
          item.idProduct === product.idProduct &&
          item.sizeProduct === product.sizeProduct &&
          item.colorProduct === product.colorProduct
      );

      if (findProductsInDeliveryStore.length > 0) {
        const firstItem = findProductsInDeliveryStore[0];
        firstItem.amountNewProduct -= product.quantity;

        const totalAmount = findProductsInDeliveryStore.reduce(
          (total, item) => total + item.amountNewProduct,
          0
        );

        if (totalAmount <= 0) {
          user.securityDelivery.products =
            user.securityDelivery.products.filter(
              (item) =>
                item.idProduct !== product.idProduct ||
                item.sizeProduct !== product.sizeProduct ||
                item.colorProduct !== product.colorProduct
            );
        }
      }

      const findProduct1 = await Products.findById(product.idProduct);

      if (findProduct1) {
        const findColor = findProduct1.details.find(
          (color) => color.color === product.colorProduct
        );

        const findSize = findColor.sizes.find(
          (size) =>
            size.size === product.sizeProduct &&
            size.city === selectedCity &&
            size.store === selectedStore
        );

        if (findSize) {
          findSize.amount += product.quantity;
        } else {
          return res.status(201).send("NoStore");
        }

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
            size.city === selectedCity &&
            size.store === selectedStore
        );

        if (findSize) {
          findSize.amount += product.quantity;
        } else {
          return res.status(201).send("NoStore");
        }

        await findProduct2.save();
      }
    }

    await user.save();

    return res.status(201).send("SUCCESS");
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
