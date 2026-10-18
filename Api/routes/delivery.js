const express = require("express");
const router = express.Router();
const Delivery = require("../controllers/deliveryController");

router.get("/getPhoneDelivery/:id", Delivery.getPhoneDelivery);
router.get("/getWalletDelivery/:id", Delivery.getWalletDelivery);
router.get("/getProductsDelivery/:id", Delivery.getProductsDelivery);
router.get("/getAllDataDelivery/:id", Delivery.getAllDataDelivery);
router.post("/getOrderToDelivery", Delivery.getOrderToDelivery);
router.post("/getOrdersToDelivery", Delivery.getOrdersToDelivery);
router.post("/scanner", Delivery.Scanner);
router.post("/edit", Delivery.EditCaseOrder);
router.post("/returnProductsToStore", Delivery.ReturnProductsToStore);

module.exports = router;
