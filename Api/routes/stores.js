const express = require("express");
const router = express.Router();
const Stores = require("../controllers/storesController");

router.get("/:id", Stores.getStores);
router.post("/getProducts", Stores.getProducts);

module.exports = router;
