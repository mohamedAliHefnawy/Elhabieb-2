require("dotenv").config();
const CryptoJS = require("crypto-js");
const Fav = require("../models/fav");
const Products = require("../models/products");

const keyHash = process.env.KEY_HASH;

exports.GetProductsInFavUser = async (req, res) => {
  try {
    const findUser = await Fav.findOne({ user: req.params.id });

    if (!findUser) {
      return res.status(404).json({ message: "User cart not found" });
    }

    const productIds = findUser.products.map((product) => product.productId);

    const allProducts = await Promise.all(
      productIds.map(async (productId) => {
        return await Products.findById(productId);
      })
    );

    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(allProducts),
      keyHash
    ).toString();

    res.json({ data: encryptedData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.FavUser = async (req, res) => {
  try {
    const { data: encryptedData } = req.body;
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, keyHash);
    const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
    const decryptedData = JSON.parse(decryptedText);

    const { idProduct, user } = decryptedData;

    let fav = await Fav.findOne({ user });

    if (!fav) {
      fav = new Fav({
        user: user,
        products: [],
      });
    }

    const newProduct = {
      productId: idProduct || "",
    };

    if (!fav.products) {
      fav.products = [];
    }

    const productExists = fav.products.some(
      (product) => product.productId === idProduct
    );

    if (productExists) {
      fav.products = fav.products.filter(
        (product) => !(product.productId === idProduct)
      );
      res.status(200).send("REMOVED_SUCCESS");
    } else {
      fav.products.push(newProduct);
      res.status(200).send("ADDED_SUCCESS");
    }

    await fav.save();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// exports.DeleteProductsWithCart = async (req, res) => {
//   try {
//     const { data: encryptedData } = req.body;
//     const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, keyHash);
//     const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
//     const decryptedData = JSON.parse(decryptedText);

//     const { selectedItemsData, user } = decryptedData;

//     const cart = await Cart.findOne({ user });
//     if (!cart) {
//       return res.status(404).json({ message: "Cart not found for user." });
//     }

//     const updatedProducts = cart.products.filter((product) => {
//       return !selectedItemsData.some(
//         (selectedItem) =>
//           selectedItem.id === product.productId &&
//           selectedItem.size === product.size &&
//           selectedItem.color === product.color
//       );
//     });

//     cart.products = updatedProducts;
//     await cart.save();

//     return res.status(200).send("Done");
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: err.message });
//   }
// };
