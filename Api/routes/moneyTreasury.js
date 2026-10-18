const express = require("express");
const router = express.Router();
const MoneyTreasury = require("../controllers/moneyTreasuryController");

router.get("/", MoneyTreasury.getMoneyTreasuries);
router.get("/:id", MoneyTreasury.getMoneyTreasury);
router.post("/addMoneyTreasury", MoneyTreasury.addMoneyTreasury);
router.post("/addMoney/:id", MoneyTreasury.addMoneyToMoneyTreasury);
router.post("/edit/:id", MoneyTreasury.editMoneyTreasury);

module.exports = router;
