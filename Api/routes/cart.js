const express = require("express");
const router = express.Router();
const Cart = require("../controllers/cartController");

router.get("/getProductsInCartUser/:id", Cart.GetProductsInCartUser);
router.post("/deleteProductsWithCart", Cart.DeleteProductsWithCart);
router.post("/cartUser", Cart.CartUser);

module.exports = router;
