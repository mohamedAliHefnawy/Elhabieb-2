const express = require("express");
const router = express.Router();
const MoneyTransfers = require("../controllers/moneyTransfersController");

router.get("/", MoneyTransfers.getMoneyTransfers);
router.post("/addMoneyTransfer", MoneyTransfers.addMoneyTransfer);
router.post("/edit/:id", MoneyTransfers.editmoneyTransfer);
router.post("/editmoneyTransferPos/:id", MoneyTransfers.editmoneyTransferPos);

module.exports = router;
