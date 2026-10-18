require("dotenv").config();
const CryptoJS = require("crypto-js");
const Products = require("../models/products");
const Categories = require("../models/categorey");

const keyHash = process.env.KEY_HASH;

exports.getProducts = async (req, res) => {
  try {
    const items = await Products.find();

    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(items),
      keyHash
    ).toString();
    res.json({ data: encryptedData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProductsInCatoagories = async (req, res) => {
  try {
    const items = await Products.find();
    const ProductsInCatogries = items.filter(
      (products) => products.catogry === req.params.id
    );
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(ProductsInCatogries),
      keyHash
    ).toString();
    res.json({ data: encryptedData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const item = await Products.findById(req.params.id);
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(item),
      keyHash
    ).toString();

    res.json({ data: encryptedData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addProduct = async (req, res) => {
  try {
    const { data: encryptedData } = req.body;

    const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, keyHash);
    const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
    const decryptedData = JSON.parse(decryptedText);

    const category = await Categories.findOne({ name: decryptedData.catogry });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const DataProducts = {
      name: decryptedData.name,
      price: decryptedData.price,
      priceMarkter: decryptedData.priceMarkter,
      gainMarkter: decryptedData.gainMarkter,
      priceCustomer: decryptedData.priceCustomer,
      colors: decryptedData.colors,
      images: decryptedData.images,
      discrubtion: decryptedData.discrubtion,
      active: decryptedData.active,
      catogry: decryptedData.catogry,
      dateAdded: decryptedData.dateAdded,
      timeAdded: decryptedData.timeAdded,
      numberSelles: decryptedData.numberSelles,
      details: decryptedData.colors.map((colorItem) => ({
        color: colorItem,
        sizes: decryptedData.sizes.map((sizeItem) => ({
          size: sizeItem.size,
          city: "",
          store: "",
          amount: 0,
        })),
      })),
      products: decryptedData.products.map((item) => ({
        name: item.name,
        price: item.price,
        priceMarkter: item.priceMarkter,
        gainMarkter: item.gainMarkter,
        priceCustomer: item.priceCustomer,
        colors: item.colors,
        images: item.images,
        discrubtion: item.discrubtion,
        active: decryptedData.active,
        catogry: item.catogry,
        dateAdded: item.dateAdded,
        timeAdded: item.timeAdded,
        numberSelles: item.numberSelles,
        details: item.colors.map((colorItem) => ({
          color: colorItem,
          sizes: item.sizes.map((sizeItem) => ({
            size: sizeItem.size,
            city: "",
            store: "",
            amount: 0,
          })),
        })),
      })),
    };

    const existingProducts = await Products.findOne({
      name: DataProducts.name,
    });

    if (existingProducts) {
      return res.send("EXIT_SURE");
    }

    const NewProducts = new Products(DataProducts);
    const savedProduct = await NewProducts.save();

    if (savedProduct) {
      category.products.push(savedProduct._id);
      await category.save();
      return res.status(201).send("ADDED_SUSESS");
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.editProduct = async (req, res) => {
  try {
    const { data: encryptedData } = req.body;

    const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, keyHash);
    const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
    const decryptedData = JSON.parse(decryptedText);

    const { name } = decryptedData;

    const existingProductByName = await Products.findOne({ name });

    if (
      existingProductByName &&
      existingProductByName._id.toString() !== req.params.id
    ) {
      return res.status(200).send("Product_NAME_EXISTS");
    }

    const existingProduct = await Products.findById(req.params.id);

    if (!existingProduct) {
      return res.status(404).send("Product_NOT_FOUND");
    }

    existingProduct.name = decryptedData.name;
    existingProduct.price = decryptedData.price;
    existingProduct.priceMarkter = decryptedData.priceMarkter;
    existingProduct.gainMarkter = decryptedData.gainMarkter;
    existingProduct.priceCustomer = decryptedData.priceCustomer;
    existingProduct.colors = decryptedData.colors;
    existingProduct.images = decryptedData.images;
    existingProduct.discrubtion = decryptedData.discrubtion;
    existingProduct.active = decryptedData.active;
    existingProduct.dateAdded = decryptedData.dateAdded;
    existingProduct.timeAdded = decryptedData.timeAdded;

    decryptedData.colors.forEach((newColor) => {
      const existingDetail = existingProduct.details.find(
        (detail) => detail.color === newColor
      );

      if (!existingDetail) {
        const allExistingSizes = [];

        existingProduct.details.forEach((detail) => {
          detail.sizes.forEach((sizeObj) => {
            if (!allExistingSizes.some((size) => size.size === sizeObj.size)) {
              allExistingSizes.push({
                size: sizeObj.size,
                city: sizeObj.city || "",
                store: sizeObj.store || "",
                amount: sizeObj.amount || 0,
              });
            }
          });
        });

        existingProduct.details.push({
          color: newColor,
          sizes: allExistingSizes,
        });
      }
    });

    decryptedData.sizes.forEach((newSize) => {
      let isSizeExists = false;

      existingProduct.details.forEach((detail) => {
        if (detail.sizes.some((size) => size.size === newSize.size)) {
          isSizeExists = true;
        }
      });

      if (!isSizeExists) {
        existingProduct.details.forEach((detail) => {
          detail.sizes.push({
            size: newSize.size,
            city: "",
            store: "",
            amount: 0,
          });
        });
      }
    });

    decryptedData.products.forEach((newProduct) => {
      const existingProductInList = existingProduct.products.find(
        (prod) => prod.name === decryptedData.name
      );

      if (!existingProductInList) {
        existingProduct.products.push(newProduct);
      } else {
        existingProductInList.price = newProduct.price;
        existingProductInList.priceMarkter = newProduct.priceMarkter;
        existingProductInList.gainMarkter = newProduct.gainMarkter;
        existingProductInList.priceCustomer = newProduct.priceCustomer;
        existingProductInList.colors = newProduct.colors;
        existingProductInList.images = newProduct.images;
        existingProductInList.discrubtion = newProduct.discrubtion;
        existingProductInList.active = newProduct.active;
        existingProductInList.dateAdded = newProduct.dateAdded;
        existingProductInList.timeAdded = newProduct.timeAdded;

        newProduct.colors.forEach((newColor) => {
          const existingColorDetail = existingProductInList.details.find(
            (detail) => detail.color === newColor
          );

          if (!existingColorDetail) {
            const allExistingSizes = [];

            existingProductInList.details.forEach((detail) => {
              detail.sizes.forEach((sizeObj) => {
                if (
                  !allExistingSizes.some((size) => size.size === sizeObj.size)
                ) {
                  allExistingSizes.push({
                    size: sizeObj.size,
                    city: sizeObj.city || "",
                    store: sizeObj.store || "",
                    amount: sizeObj.amount || 0,
                  });
                }
              });
            });

            existingProductInList.details.push({
              color: newColor,
              sizes: allExistingSizes,
            });
          }
        });
        newProduct.sizes.forEach((newSize) => {
          let isSizeExists = false;

          existingProductInList.details.forEach((detail) => {
            if (detail.sizes.some((size) => size.size === newSize.size)) {
              isSizeExists = true;
            }
          });

          if (!isSizeExists) {
            existingProductInList.details.forEach((detail) => {
              detail.sizes.push({
                size: newSize.size,
                city: "",
                store: "",
                amount: 0,
              });
            });
          }
        });
      }
    });

    const updatedProduct = await existingProduct.save();

    if (updatedProduct) {
      return res.status(200).send("EDIT_SUCCESS");
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteSizeOrColor = async (req, res) => {
  try {
    const { data: encryptedData } = req.body;

    const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, keyHash);
    const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
    const decryptedData = JSON.parse(decryptedText);

    const { size, _id, slug, color } = decryptedData;

    const existingProductById = await Products.findById(slug);

    let foundProduct = existingProductById;

    if (!foundProduct) {
      foundProduct = await Products.findOne({ "products._id": _id });
      if (foundProduct) {
        foundProduct = foundProduct.products.find(
          (prod) => prod._id.toString() === _id
        );
      }
    }

    if (foundProduct) {
      const removeColorFromDetails = (details, targetColor) => {
        const indexToRemove = details.findIndex(
          (colorObj) => colorObj.color === targetColor
        );
        if (indexToRemove !== -1) {
          details.splice(indexToRemove, 1);
        }
      };

      const removeColorFromColors = (colors, targetColor) => {
        const indexToRemove = colors.indexOf(targetColor);
        if (indexToRemove !== -1) {
          colors.splice(indexToRemove, 1);
        }
      };

      foundProduct.details.forEach((colorObj) => {
        colorObj.sizes = colorObj.sizes.filter(
          (sizeObj) => sizeObj.size !== size
        );
      });

      removeColorFromDetails(foundProduct.details, color);
      removeColorFromColors(foundProduct.colors, color);

      if (existingProductById && existingProductById._id.toString() === slug) {
        existingProductById.products.forEach((subProduct) => {
          subProduct.details.forEach((colorObj) => {
            colorObj.sizes = colorObj.sizes.filter(
              (sizeObj) => sizeObj.size !== size
            );
          });

          removeColorFromDetails(subProduct.details, color);
          removeColorFromColors(subProduct.colors, color);
        });
      }
    }

    const updatedProduct = await (foundProduct
      ? foundProduct.save()
      : existingProductById.save());
    if (updatedProduct) {
      return res.status(200).send("EDIT_SUCCESS");
    } else {
      return res.status(500).send("ERROR_SAVING_PRODUCT");
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
