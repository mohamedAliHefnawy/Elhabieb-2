const express = require("express");
const router = express.Router();
const Cart = require("../controllers/cartController");
const Pos = require("../controllers/posController");

router.get("/", Pos.GetPos);
router.get("/getPosById/:id", Pos.GetPosById);
router.get("/getOrdersPos/:id", Pos.GetOrdersPos);
router.get("/getOrderPos/:id", Pos.GetOrderPos);
router.get("/getMoneyPos/:id", Pos.GetMoneyPos);
router.post("/addPos", Pos.AddPos);
router.post("/editPos", Pos.EditPos);
router.post("/newInvoice", Pos.NewInvoice);
router.post("/editVoice", Pos.EditVoice);

module.exports = router;
