const express = require("express");
const router = express.Router();
const Report = require("../controllers/reportesController");

router.get("/orders", Report.FetchOrders);
router.get("/clients", Report.FetchTopClients);
router.get("/markter", Report.FetchTopMarkters);
router.get("/delivery", Report.Fetch2DataDelivery);
router.get("/products", Report.FetchTopProducts);
router.get("/stores", Report.FetchStores);

module.exports = router;
