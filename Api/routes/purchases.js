const express = require("express");
const router = express.Router();
const Purchases = require("../controllers/purchasesController");

router.get("/", Purchases.getPurchases);
router.post("/addpurchase", Purchases.AddPurchase);
router.post("/payPurchase/:id", Purchases.PayPurchase);

module.exports = router;
