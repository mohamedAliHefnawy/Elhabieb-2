require("dotenv").config();
const CryptoJS = require("crypto-js");
const WithdrawReq = require("../models/withdrawReq");
const Users = require("../models/user");
const MoneyTreasury = require("../models/moneyTreasury");

const keyHash = process.env.KEY_HASH;

exports.getWithdrawReq = async (req, res) => {
  try {
    const items = await WithdrawReq.find();
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(items),
      keyHash
    ).toString();

    res.json({ data: encryptedData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getWithdrawReqToUser = async (req, res) => {
  try {
    const withdrawReqToUser = await WithdrawReq.find({
      user: req.params.id,
    });

    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(withdrawReqToUser),
      keyHash
    ).toString();

    res.json({ data: encryptedData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addWithdrawReq = async (req, res) => {
  try {
    const { data: encryptedData } = req.body;

    const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, keyHash);
    const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
    const decryptedData = JSON.parse(decryptedText);

    const user = await Users.findOne({
      email: decryptedData.user,
    });

    for (const item2 of decryptedData.money) {
      const userWalletOrderMoney = user.wallet.find(
        (item) => item.orderId === item2.orderId
      );

      userWalletOrderMoney.status = "OnCall";
    }

    const NewWithdrawReq = new WithdrawReq(decryptedData);
    const save = await NewWithdrawReq.save();
    const SaveUser = await user.save();

    if (save && SaveUser) {
      return res.status(201).send("ADDED_SUSESS");
    }
  } catch (err) {
    return res.status(201).send("FAILIED");
  }
};

exports.editWithdrawReq = async (req, res) => {
  try {
    const { data: encryptedData } = req.body;

    const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, keyHash);
    const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
    const decryptedData = JSON.parse(decryptedText);

    const user = await Users.findOne({
      email: decryptedData.user,
    });

    const moneyTreasury = await MoneyTreasury.findOne({
      name: decryptedData.moneyTreasury,
    });

    const withdrawReq = await WithdrawReq.findById(decryptedData.idWithdraReq);

    for (const item2 of decryptedData.money) {
      const userWalletOrderMoney = user.wallet.find(
        (item) => item.orderId === item2.orderId
      );

      userWalletOrderMoney.status = "DonePay";
    }

    moneyTreasury.money.push({
      valueMoney: -decryptedData.money.reduce((a, b) => a + b.money, 0),
      note: "تحويل أموال  لـ مندوب تسويق",
      person: "محمد علي",
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
    });

    withdrawReq.state = "Done";

    const SaveUser = await user.save();
    const SaveMoneyTreasury = await moneyTreasury.save();
    const SaveWithdrawReq = await withdrawReq.save();

    if (SaveUser && SaveMoneyTreasury && SaveWithdrawReq) {
      return res.status(200).send("SUCCESS");
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
