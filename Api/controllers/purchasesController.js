require("dotenv").config();
const CryptoJS = require("crypto-js");
const Purchases = require("../models/purchases");
const Products = require("../models/products");
const Cities = require("../models/cities");
const MoneyTreasury = require("../models/moneyTreasury");

const keyHash = process.env.KEY_HASH;

exports.getPurchases = async (req, res) => {
  try {
    const items = await Purchases.find();

    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(items),
      keyHash
    ).toString();

    res.json({ data: encryptedData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.AddPurchase = async (req, res) => {
  try {
    const { data: encryptedData } = req.body;

    const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, keyHash);
    const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
    const decryptedData = JSON.parse(decryptedText);

    const city = await Cities.findOne({ name: decryptedData.selectedCity });
    const store = city.stores.find(
      (store) => store.nameStore === decryptedData.selectedStore
    );
    decryptedData.productData.forEach((product) => {
      const productExists = store.products.some(
        (storeProduct) => storeProduct.id === product.id
      );

      if (!productExists) {
        store.products.push({
          id: product.id,
        });
      }
    });

    await Cities.updateOne(
      { _id: city._id, "stores._id": store._id },
      { $set: { "stores.$.products": store.products } }
    );

    const DataPurchase = {
      supplier: decryptedData.selectedSupplier,
      moneyTreasury: decryptedData.selectedMoneyTreasury,
      city: decryptedData.selectedCity,
      store: decryptedData.selectedStore,
      totalValuePurchase: decryptedData.TotalMoneyPurchases,
      paymentMoneyDetails: [],
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      productData: decryptedData.productData,
    };

    for (const item of decryptedData.productData) {
      const findProduct = await Products.findById(item.id);

      if (findProduct) {
        const colorMatch = findProduct.details.find(
          (detail) => detail.color === item.color
        );

        if (colorMatch) {
          const sizeMatch = colorMatch.sizes.find(
            (sizeItem) =>
              sizeItem.size === item.size &&
              sizeItem.city === decryptedData.selectedCity &&
              sizeItem.store === decryptedData.selectedStore
          );

          if (sizeMatch) {
            sizeMatch.amount += item.amount;
          } else {
            colorMatch.sizes.push({
              size: item.size,
              city: decryptedData.selectedCity,
              store: decryptedData.selectedStore,
              amount: item.amount,
            });
          }
        } else {
          findProduct.details.push({
            color: item.color,
            sizes: [
              {
                size: item.size,
                city: decryptedData.selectedCity,
                store: decryptedData.selectedStore,
                amount: item.amount,
              },
            ],
          });
        }

        await findProduct.save();
      } else {
        const findProduct2 = await Products.findOne({
          "products._id": item.id,
        });

        if (findProduct2) {
          const childProduct = findProduct2.products.find(
            (p) => p._id.toString() === item.id
          );

          if (childProduct) {
            const colorMatch = childProduct.details.find(
              (detail) => detail.color === item.color
            );

            if (colorMatch) {
              const sizeMatch = colorMatch.sizes.find(
                (sizeItem) =>
                  sizeItem.size === item.size &&
                  sizeItem.city === decryptedData.selectedCity &&
                  sizeItem.store === decryptedData.selectedStore
              );

              if (sizeMatch) {
                sizeMatch.amount += item.amount;
              } else {
                colorMatch.sizes.push({
                  size: item.size,
                  city: decryptedData.selectedCity,
                  store: decryptedData.selectedStore,
                  amount: item.amount,
                });
              }
            } else {
              childProduct.details.push({
                color: item.color,
                sizes: [
                  {
                    size: item.size,
                    city: decryptedData.selectedCity,
                    store: decryptedData.selectedStore,
                    amount: item.amount,
                  },
                ],
              });
            }

            await findProduct2.save();
          }
        }
      }
    }

    const NewPurchase = new Purchases(DataPurchase);
    const save = await NewPurchase.save();

    if (save) {
      return res.status(201).send("ADDED_SUSESS");
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.PayPurchase = async (req, res) => {
  try {
    const { data: encryptedData } = req.body;

    const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, keyHash);
    const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
    const decryptedData = JSON.parse(decryptedText);

    const purchase = await Purchases.findById(req.params.id);
    const moneyTreasury = await MoneyTreasury.findOne({
      name: decryptedData.selectedMoneyTreasury,
    });

    purchase.paymentMoneyDetails.push({
      valueMoney: +decryptedData.moneyValue,
      employ: decryptedData.employ,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
    });

    moneyTreasury.money.push({
      valueMoney: -+decryptedData.moneyValue,
      note: `سد دين فاتورة`,
      person: decryptedData.employ,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
    });

    const save = await purchase.save();
    const saveMoneyTreasury = await moneyTreasury.save();

    if (save && saveMoneyTreasury) {
      return res.status(201).send("SUSESS");
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
