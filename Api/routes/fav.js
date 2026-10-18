const express = require("express");
const router = express.Router();
const Fav = require("../controllers/favController");

router.get("/getProductsInFavUser/:id", Fav.GetProductsInFavUser);
// router.post("/deleteProductsWithCart", Fav.DeleteProductsWithFav);
router.post("/favUser", Fav.FavUser);

module.exports = router;
