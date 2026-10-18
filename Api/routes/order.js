const express = require("express");
const router = express.Router();
const Order = require("../controllers/orderController");

router.get("/", Order.getOrders);
router.get("/getOrder/:id", Order.getOrder);
router.get("/getOrderUser/:id", Order.getOrderUser);
router.get("/getChatOrder/:id", Order.ChatOrder);
router.post("/addOrder", Order.addOrder);
router.post("/editOrder", Order.EditOrder);
router.post("/chat", Order.Chat);
router.post("/editChat", Order.EditChat);

module.exports = router;
