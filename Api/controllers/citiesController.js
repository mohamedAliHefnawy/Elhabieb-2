require("dotenv").config();
const CryptoJS = require("crypto-js");
const Cities = require("../models/cities");
const Products = require("../models/products");

const keyHash = process.env.KEY_HASH;

exports.getCities = async (req, res) => {
  try {
    const items = await Cities.find();

    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(items),
      keyHash
    ).toString();

    res.json({ data: encryptedData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCity = async (req, res) => {
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

exports.getProductsWithStore = async (req, res) => {
  try {
    const [idCity, idStore] = req.params.id.split("-");

    const item = await Cities.findById(idCity);
    if (!item) {
      return res.status(404).json({ message: "City not found" });
    }
    const findStore = item.stores.find(
      (store) => store._id.toString() === idStore.toString()
    );
    const IdsProductsInStore = findStore.products;
    const allProducts = [];

    for (const product of IdsProductsInStore) {
      const productsInCart = await Products.find({
        _id: product.id,
      });

      allProducts.push(...productsInCart);

      if (productsInCart && productsInCart.length > 0) {
      } else {
        const findProduct2 = await Products.findOne({
          "products._id": product.id,
        });

        const childProduct = findProduct2.products.find(
          (p) => p._id.toString() === product.id
        );

        allProducts.push(childProduct);
      }
    }
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify({
        data: allProducts,
        city: item.name,
        store: findStore.nameStore,
      }),
      keyHash
    ).toString();

    res.json({
      data: encryptedData,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addCity = async (req, res) => {
  try {
    const { data: encryptedData } = req.body;

    const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, keyHash);
    const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
    const decryptedData = JSON.parse(decryptedText);

    const DataCity = {
      name: decryptedData.nameCity,
      character: decryptedData.character,
      prices: decryptedData.pricesCity.map((item) => ({
        name: item.nameCity,
        price: item.priceDeliveryCity,
      })),
      stores: decryptedData.stores.map((item) => ({
        nameStore: item.nameStore,
        codeStore: item.codeStore,
        products: [],
      })),
    };

    const existingCity = await Cities.findOne({
      name: DataCity.name,
    });

    if (existingCity) {
      return res.send("EXIT_SURE");
    }

    const NewCity = new Cities(DataCity);
    const save = await NewCity.save();

    if (save) {
      return res.status(201).send("ADDED_SUSESS");
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.editCity = async (req, res) => {
  try {
    const { data: encryptedData } = req.body;

    const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, keyHash);
    const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
    const decryptedData = JSON.parse(decryptedText);

    const { nameCity, character, pricesCity, stores } = decryptedData;

    const existingCityByName = await Cities.findOne({ name: nameCity });

    if (
      existingCityByName &&
      existingCityByName._id.toString() !== req.params.id
    ) {
      return res.status(200).send("CITY_NAME_EXISTS");
    }

    const existingCity = await Cities.findById(req.params.id);

    if (!existingCity) {
      return res.status(404).send("CITY_NOT_FOUND");
    }

    existingCity.name = nameCity;
    existingCity.character = character;
    existingCity.prices = pricesCity.map((item) => ({
      name: item.nameCity,
      price: item.priceDeliveryCity,
    }));
    existingCity.stores = stores.map((item) => ({
      nameStore: item.nameStore,
      codeStore: item.codeStore,
    }));
    const updatedCity = await existingCity.save();

    if (updatedCity) {
      return res.status(200).send("EDIT_SUCCESS");
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.ConvertProducts = async (req, res) => {
  try {
    const { data: encryptedData } = req.body;

    const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, keyHash);
    const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
    const decryptedData = JSON.parse(decryptedText);

    const { selectedCity, selectedStore, productSelections, idCity, idStore } =
      decryptedData;

    const city = await Cities.findOne({ name: selectedCity });
    const store = city.stores.find(
      (store) => store.nameStore === selectedStore
    );
    Object.keys(productSelections).forEach((product) => {
      const productExists = store.products.some(
        (storeProduct) => storeProduct.id === product
      );

      if (!productExists) {
        store.products.push({
          id: product,
        });
      }
    });

    const city2 = await Cities.findById(idCity);
    const store2 = city2.stores.find(
      (store) => store._id.toString() === idStore.toString()
    );

    await Cities.updateOne(
      { _id: city._id, "stores._id": store._id },
      { $set: { "stores.$.products": store.products } }
    );

    for (const product of Object.keys(productSelections)) {
      const size = productSelections[product].size;
      const color = productSelections[product].color;
      const quantity = productSelections[product].quantity;

      const findProduct = await Products.findById(product);

      if (findProduct) {
        const colorMatch = findProduct.details.find(
          (detail) => detail.color === color
        );

        if (colorMatch) {
          const sizeMatch = colorMatch.sizes.find(
            (sizeItem) =>
              sizeItem.size === size &&
              sizeItem.city === selectedCity &&
              sizeItem.store === selectedStore
          );

          const sizeMatch2 = colorMatch.sizes.find(
            (sizeItem) =>
              sizeItem.size === size &&
              sizeItem.city === city2.name &&
              sizeItem.store === store2.nameStore
          );

          if (sizeMatch) {
            sizeMatch.amount += quantity;
            await findProduct.save();
            sizeMatch2.amount -= quantity;
            await findProduct.save();
          } else {
            colorMatch.sizes.push({
              size: size,
              city: selectedCity,
              store: selectedStore,
              amount: quantity,
            });
            sizeMatch2.amount -= quantity;
            await findProduct.save();
          }
        } else {
          findProduct.details.push({
            color: color,
            sizes: [
              {
                size: size,
                city: selectedCity,
                store: selectedStore,
                amount: quantity,
              },
            ],
          });
          sizeMatch2.amount -= quantity;
          await findProduct.save();
        }

        const SaveProsduct = await findProduct.save();
        if (SaveProsduct) {
          return res.status(200).send("SUCCESS");
        }
      } else {
        const findProduct2 = await Products.findOne({
          "products._id": product,
        });

        if (findProduct2) {
          const childProduct = findProduct2.products.find(
            (p) => p._id.toString() === product
          );

          if (childProduct) {
            const colorMatch = childProduct.details.find(
              (detail) => detail.color === color
            );

            if (colorMatch) {
              const sizeMatch = colorMatch.sizes.find(
                (sizeItem) =>
                  sizeItem.size === size &&
                  sizeItem.city === selectedCity &&
                  sizeItem.store === selectedStore
              );

              const sizeMatch2 = colorMatch.sizes.find(
                (sizeItem) =>
                  sizeItem.size === size &&
                  sizeItem.city === city2.name &&
                  sizeItem.store === store2.nameStore
              );

              if (sizeMatch) {
                sizeMatch.amount += quantity;
                await findProduct.save();
                sizeMatch2.amount -= quantity;
                await findProduct.save();
              } else {
                colorMatch.sizes.push({
                  size: size,
                  city: selectedCity,
                  store: selectedStore,
                  amount: quantity,
                });
                sizeMatch2.amount -= quantity;
                await findProduct.save();
              }
            } else {
              childProduct.details.push({
                color: color,
                sizes: [
                  {
                    size: size,
                    city: selectedCity,
                    store: selectedStore,
                    amount: quantity,
                  },
                ],
              });
              sizeMatch2.amount -= quantity;
              await findProduct.save();
            }

            const SaveProsduct = await findProduct2.save();
            if (SaveProsduct) {
              return res.status(200).send("SUCCESS");
            }
          }
        }
      }
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
