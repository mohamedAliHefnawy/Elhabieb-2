require("dotenv").config();
const CryptoJS = require("crypto-js");
const Cart = require("../models/cart");
const Products = require("../models/products");

const keyHash = process.env.KEY_HASH;

exports.GetProductsInCartUser = async (req, res) => {
  try {
    const findUser = await Cart.findOne({ user: req.params.id });

    if (!findUser) {
      return res.status(404).json({ message: "User cart not found" });
    }

    const productsDetails = findUser.products.map((product) => ({
      productId: product.productId,
      color: product.color,
      size: product.size,
    }));

    const allProducts = [];

    for (const product of productsDetails) {
      const productsInCart = await Products.find({
        _id: product.productId,
      });

      if (productsInCart && productsInCart.length > 0) {
        const productReturn = productsInCart.map((item) => {
          const colorDetail = item.details.find(
            (color) => color.color === product.color
          );

          const sizesDetails = colorDetail
            ? colorDetail.sizes.map((size) => ({
                city: size.city,
                store: size.store,
                amount: size.amount,
                size: size.size,
                color: product.color,
              }))
            : [];

          return {
            _id: item._id,
            name: item.name,
            images: item.images[0],
            category: item.catogry,
            color: product.color,
            size: product.size,
            price: item.price,
            priceMarkter: item.priceMarkter,
            gainMarkter: item.gainMarkter,
            priceCustomer: item.priceCustomer,
            amounts: sizesDetails,
          };
        });

        allProducts.push(...productReturn);
      } else {
        const findProduct2 = await Products.findOne({
          "products._id": product.productId,
        });

        const childProduct = findProduct2.products.find(
          (p) => p._id.toString() === product.productId
        );

        const colorDetail = childProduct.details.find(
          (color) => color.color === product.color
        );
        const sizesDetails = colorDetail
          ? colorDetail.sizes.map((size) => ({
              city: size.city,
              store: size.store,
              amount: size.amount,
              size: size.size,
              color: product.color,
            }))
          : [];

        allProducts.push({
          _id: childProduct._id,
          name: childProduct.name,
          images: childProduct.images[0],
          category: childProduct.catogry,
          color: product.color,
          size: product.size,
          price: childProduct.price,
          priceMarkter: childProduct.priceMarkter,
          gainMarkter: childProduct.gainMarkter,
          priceCustomer: childProduct.priceCustomer,
          amounts: sizesDetails,
        });
      }
    }

    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(allProducts),
      keyHash
    ).toString();

    res.json({ data: encryptedData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.CartUser = async (req, res) => {
  try {
    const { data: encryptedData } = req.body;
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, keyHash);
    const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
    const decryptedData = JSON.parse(decryptedText);

    const { idProduct, user, colorProduct, sizeProduct } = decryptedData;

    let cart = await Cart.findOne({ user });

    if (!cart) {
      cart = new Cart({
        user: user,
        products: [],
      });
    }

    const newProduct = {
      productId: idProduct || "",
      color: colorProduct,
      size: sizeProduct,
    };

    if (!cart.products) {
      cart.products = [];
    }

    const productExists = cart.products.some(
      (product) =>
        product.productId === idProduct &&
        product.color === colorProduct &&
        product.size === sizeProduct
    );

    if (productExists) {
      cart.products = cart.products.filter(
        (product) =>
          !(
            product.productId === idProduct &&
            product.color === colorProduct &&
            product.size === sizeProduct
          )
      );
      res.status(200).send("REMOVED_SUCCESS");
    } else {
      cart.products.push(newProduct);
      res.status(200).send("ADDED_SUCCESS");
    }

    await cart.save();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.DeleteProductsWithCart = async (req, res) => {
  try {
    const { data: encryptedData } = req.body;
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, keyHash);
    const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
    const decryptedData = JSON.parse(decryptedText);

    const { selectedItemsData, user } = decryptedData;

    const cart = await Cart.findOne({ user });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found for user." });
    }

    const updatedProducts = cart.products.filter((product) => {
      return !selectedItemsData.some(
        (selectedItem) =>
          selectedItem.id === product.productId &&
          selectedItem.size === product.size &&
          selectedItem.color === product.color
      );
    });

    cart.products = updatedProducts;
    await cart.save();

    return res.status(200).send("Done");
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
