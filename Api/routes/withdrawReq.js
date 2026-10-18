const express = require("express");
const router = express.Router();
const WithdrawReq = require("../controllers/withdrawReqController");

router.get("/", WithdrawReq.getWithdrawReq);
router.get("/getWithdrawReqsToUser/:id", WithdrawReq.getWithdrawReqToUser);
router.post("/addWithdrawReq", WithdrawReq.addWithdrawReq);
router.post("/edit/:id", WithdrawReq.editWithdrawReq);

module.exports = router;
