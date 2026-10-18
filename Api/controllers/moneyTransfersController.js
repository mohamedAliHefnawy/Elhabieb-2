require("dotenv").config();
const CryptoJS = require("crypto-js");
const MoneyTransfers = require("../models/moneyTransfers");
const Users = require("../models/user");
const Pos = require("../models/pos");
const Order = require("../models/order");
const MoneyTreasury = require("../models/moneyTreasury");

const keyHash = process.env.KEY_HASH;

exports.getMoneyTransfers = async (req, res) => {
  try {
    const items = await MoneyTransfers.find();

    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(items),
      keyHash
    ).toString();

    res.json({ data: encryptedData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addMoneyTransfer = async (req, res) => {
  try {
    const { data: encryptedData } = req.body;

    const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, keyHash);
    const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
    const decryptedData = JSON.parse(decryptedText);

    const user = await Users.findOne({ email: decryptedData.namerSender });
    const pos = await Pos.findOne({ email: decryptedData.namerSender });

    if (user) {
      for (const item of decryptedData.money) {
        const userWalletOrderMoney = user.securityDelivery.money.find(
          (item2) => item2.orderId === item.orderId
        );

        if (userWalletOrderMoney) {
          userWalletOrderMoney.status = "في إنتظار قبول الأدمن";
        }
      }

      await user.save();

      const NewMoneyTransfers = new MoneyTransfers(decryptedData);
      const save = await NewMoneyTransfers.save();

      if (save) {
        return res.status(201).send("ADDED_SUSESS");
      }
    } else if (pos) {
      for (const item of decryptedData.money) {
        const posWalletOrderMoney = pos.money.find(
          (item2) => item2.CodeInvoice === item.codeOrder
        );

        const order = pos.orders.find(
          (item2) => item2.CodeInvoice === item.codeOrder
        );

        if (posWalletOrderMoney && order) {
          posWalletOrderMoney.status = "InAdmin";
          order.status = "InAdmin";
        }
      }
      await pos.save();

      const NewMoneyTransfers = new MoneyTransfers(decryptedData);
      const save = await NewMoneyTransfers.save();

      if (save) {
        return res.status(201).send("ADDED_SUSESS");
      }
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.editmoneyTransfer = async (req, res) => {
  try {
    const { data: encryptedData } = req.body;

    const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, keyHash);
    const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
    const decryptedData = JSON.parse(decryptedText);

    const {
      idMoneyTransfer,
      orderId,
      money,
      state,
      selectedMoneyTreasury,
      OrdersIds,
    } = decryptedData;

    if (state === "only") {
      const moneyTransfer = await MoneyTransfers.findById(idMoneyTransfer);
      const order = await Order.findById(orderId);
      const user = await Users.findOne({ email: order.markter });
      const delivery = await Users.findOne({
        email: moneyTransfer.namerSender,
      });
      const moneyTreasury = await MoneyTreasury.findOne({
        name: selectedMoneyTreasury,
      });

      delivery.securityDelivery.money.find(
        (item) => item.orderId === orderId
      ).status = "تم الإستلام بنجاح";

      const FiltersMoney = moneyTransfer.money.filter(
        (item) => item.orderId !== orderId
      );
      moneyTransfer.money = FiltersMoney;

      if (user.validity === "Markter") {
        user.wallet.find((item) => item.orderId === orderId).status = "PayAble";
      }

      order.casesOrder.push({
        case: "تم إستلام الكاش",
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
      });

      moneyTreasury.money.push({
        valueMoney: money,
        note: `فلوس طلبية ${orderId} من المستخدم ${order.markter}`,
        person: "محمد علي",
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
      });

      const SaveMoneyTransfer = await moneyTransfer.save();
      const SaveOrder = await order.save();
      const SaveUser = await user.save();
      const SaveDelivery = await delivery.save();
      const SaveMoneyTreasury = await moneyTreasury.save();

      if (
        SaveMoneyTransfer &&
        SaveOrder &&
        SaveUser &&
        SaveMoneyTreasury &&
        SaveDelivery
      ) {
        try {
          if (moneyTransfer.money.length === 0) {
            await moneyTransfer.deleteOne({ _id: idMoneyTransfer });
            return res.status(200).send("SAVE_SUSESS_AND_DELETE");
          } else {
            return res.status(200).send("SAVE_SUSESS");
          }
        } catch (error) {
          console.error("Error deleting money transfer:", error);
        }
      }
    } else {
      const moneyTreasury = await MoneyTreasury.findOne({
        name: selectedMoneyTreasury,
      });

      for (const item of OrdersIds) {
        const order = await Order.findById(item.orderId);
        const user = await Users.findOne({ email: order.markter });
        const delivery = await Users.findOne({ email: order.delivery });

        delivery.securityDelivery.money.find(
          (item2) => item2.orderId === item.orderId
        ).status = "تم الإستلام بنجاح";

        if (user.validity === "Markter") {
          const walletItem = user.wallet.find(
            (item2) => item2.orderId === item.orderId
          );
          if (walletItem) {
            walletItem.status = "PayAble";
          }
        }

        order.casesOrder.push({
          case: "تم إستلام الكاش",
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString(),
        });

        moneyTreasury.money.push({
          valueMoney: item.money,
          note: `فلوس طلبية ${item.orderId} من المستخدم ${order.markter}`,
          person: "محمد علي",
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString(),
        });

        await order.save();
        await user.save();
        await delivery.save();
      }

      const SaveMoneyTransfer = await MoneyTransfers.deleteOne({
        _id: idMoneyTransfer,
      });
      const SaveMoneyTreasury = await moneyTreasury.save();

      if (SaveMoneyTransfer && SaveMoneyTreasury) {
        return res.status(200).send("SAVE_SUSESS_AND_DELETE");
      }
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.editmoneyTransferPos = async (req, res) => {
  try {
    const { data: encryptedData } = req.body;

    const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, keyHash);
    const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
    const decryptedData = JSON.parse(decryptedText);

    const {
      idMoneyTransfer,
      orderId,
      codeOrder,
      money,
      state,
      selectedMoneyTreasury,
      OrdersIds,
    } = decryptedData;

    if (state === "only") {
      const moneyTransfer = await MoneyTransfers.findById(idMoneyTransfer);
      const moneyTreasury = await MoneyTreasury.findOne({
        name: selectedMoneyTreasury,
      });

      const FiltersMoney = moneyTransfer.money.filter(
        (item) => item.codeOrder !== codeOrder
      );
      moneyTransfer.money = FiltersMoney;

      moneyTreasury.money.push({
        valueMoney: money,
        note: `فلوس طلبية ${codeOrder} من المستخدم ${moneyTransfer.namerSender}`,
        person: "محمد علي",
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
      });

      const SaveMoneyTransfer = await moneyTransfer.save();
      const SaveMoneyTreasury = await moneyTreasury.save();

      if (SaveMoneyTransfer && SaveMoneyTreasury) {
        try {
          if (moneyTransfer.money.length === 0) {
            await moneyTransfer.deleteOne({ _id: idMoneyTransfer });
            return res.status(200).send("SAVE_SUSESS_AND_DELETE");
          } else {
            return res.status(200).send("SAVE_SUSESS");
          }
        } catch (error) {
          console.error("Error deleting money transfer:", error);
        }
      }
    } else {
      const moneyTreasury = await MoneyTreasury.findOne({
        name: selectedMoneyTreasury,
      });
      const moneyTransfer = await MoneyTransfers.findById(idMoneyTransfer);

      for (const item of OrdersIds) {
        moneyTreasury.money.push({
          valueMoney: item.money,
          note: `فلوس طلبية ${item.codeOrder} من المستخدم ${moneyTransfer.namerSender}`,
          person: "محمد علي",
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString(),
        });
      }

      const SaveMoneyTransfer = await MoneyTransfers.deleteOne({
        _id: idMoneyTransfer,
      });
      const SaveMoneyTreasury = await moneyTreasury.save();

      if (SaveMoneyTransfer && SaveMoneyTreasury) {
        return res.status(200).send("SAVE_SUSESS_AND_DELETE");
      }
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
