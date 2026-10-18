require("dotenv").config();
const CryptoJS = require("crypto-js");
const Users = require("../models/user");
const Pos = require("../models/pos");
const Order = require("../models/order");
const Products = require("../models/products");
const bcyrbt = require("bcrypt");
const saltRounds = 10;
const keyHash = process.env.KEY_HASH;

exports.getUsers = async (req, res) => {
  try {
    const items = await Users.find();

    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(items),
      keyHash
    ).toString();

    res.json({ data: encryptedData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await Users.findById(req.params.id);

    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(user),
      keyHash
    ).toString();

    res.json({ data: encryptedData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getWalletUser = async (req, res) => {
  try {
    const user = await Users.findOne({ email: req.params.id });

    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(user.wallet),
      keyHash
    ).toString();

    res.json({ data: encryptedData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getClients = async (req, res) => {
  try {
    const items = await Users.find();

    const clients = items.filter((user) => user.validity === "Client");

    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(clients),
      keyHash
    ).toString();

    res.json({ data: encryptedData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.getAdmins = async (req, res) => {
  try {
    const items = await Users.find();

    const admins = items.filter((user) => user.validity === "Admin");

    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(admins),
      keyHash
    ).toString();

    res.json({ data: encryptedData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getEmployes = async (req, res) => {
  try {
    const items = await Users.find();

    const employes = items.filter((user) => user.validity === "Employ");

    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(employes),
      keyHash
    ).toString();

    res.json({ data: encryptedData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMarkters = async (req, res) => {
  try {
    const items = await Users.find();

    const marketers = items.filter((user) => user.validity === "Markter");
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(marketers),
      keyHash
    ).toString();

    res.json({ data: encryptedData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getDeliveries = async (req, res) => {
  try {
    const items = await Users.find();

    const marketers = items.filter((user) => user.validity === "Delivery");
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(marketers),
      keyHash
    ).toString();

    res.json({ data: encryptedData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.registerUser = async (req, res) => {
  try {
    const { data: encryptedData } = req.body;

    const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, keyHash);
    const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
    const decryptedData = JSON.parse(decryptedText);

    const { email, phone, password, firstName, lastName } = decryptedData;

    const existingUserEmail = await Users.findOne({ email });
    const existingUserPhone = await Users.findOne({ phone });

    if (existingUserEmail) {
      return res.send("ExistingUserSureEmail");
    }

    if (existingUserPhone) {
      return res.send("ExistingUserSurePhone");
    }

    const hashedPassword = await bcyrbt.hash(password, saltRounds);

    const DataUser = {
      image: "",
      email,
      phone,
      firstName,
      secondName: lastName,
      password: hashedPassword,
      validity: "Client",
    };

    const NewUser = new Users(DataUser);
    await NewUser.save();

    return res.status(201).send("ADDED_SUCCESS");
  } catch (error) {
    console.error("Error in registerUser:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { data: encryptedData } = req.body;

    const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, keyHash);
    const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
    const decryptedData = JSON.parse(decryptedText);

    const { email, password } = decryptedData;

    let user = await Users.findOne({ email });

    if (!user) {
      user = await Pos.findOne({ email });

      if (!user) {
        return res.send("USER_NOT_FOUND");
      }
    }

    const comparePassword = await bcyrbt.compare(password, user.password);
    if (!comparePassword) {
      return res.send("PASSWORD_ERROR");
    }

    return res.status(201).json({
      state: "Login_Successful",
      id: user._id,
      image: user.image,
      email: user.email,
      phone: user.phone,
      firstName: user?.firstName || "",
      secondName: user?.secondName || "",
      password: user.password,
      validity: user.validity,
      company: user.company || {},
      phoneCompany: user?.phoneCompany || "",
      colorCompany: user?.colorCompany || "",
      city: user?.city || "",
      store: user?.store || "",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.loginUserByGoogle = async (req, res) => {
  try {
    const { data: encryptedData } = req.body;

    const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, keyHash);
    const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
    const decryptedData = JSON.parse(decryptedText);

    const { email, image, phone, firstName, secondName } = decryptedData;

    const existingUser = await Users.findOne({ email });

    if (existingUser) {
      return res.status(201).json({
        state: "Login_Successful",
        id: existingUser._id,
        image: existingUser.image,
        email: existingUser.email,
        phone: existingUser.phone,
        firstName: existingUser.firstName,
        secondName: existingUser.secondName,
        password: existingUser.password,
        validity: existingUser.validity,
        company: existingUser.company,
      });
    } else {
      const hashedPassword = await bcyrbt.hash("123456789", saltRounds);

      const DataUser = {
        image: image,
        email,
        phone: phone === null ? "N/A" : phone,
        firstName: firstName,
        secondName: "",
        password: hashedPassword,
        validity: "Client",
      };

      const NewUser = new Users(DataUser);
      await NewUser.save();
      return res.status(201).json({
        state: "ADDED_SUCCESS",
        image: image,
        email,
        phone: phone === null ? "N/A" : phone,
        firstName: firstName,
        secondName: "",
        password: hashedPassword,
        validity: "Client",
        company: "",
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

exports.loginWallet = async (req, res) => {
  try {
    const { data: encryptedData } = req.body;

    const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, keyHash);
    const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
    const decryptedData = JSON.parse(decryptedText);

    const { password, user } = decryptedData;

    const userFind = await Users.findOne({
      email: user,
    });

    const comparePassword = await bcyrbt.compare(
      password,
      userFind.passwordWallet
    );

    if (!comparePassword) {
      return res.send("PASSWORD_ERROR");
    }

    return res.status(201).send("SUSESS");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

exports.editUser = async (req, res) => {
  try {
    const { data: encryptedData } = req.body;

    const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, keyHash);
    const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
    const decryptedData = JSON.parse(decryptedText);

    const {
      name,
      email,
      password,
      passwordNew,
      validity,
      image,
      passwordWallet,
      phone,
      color,
      phoneCompany,
      nameCompany,
      imgCompany,
    } = decryptedData;

    if (passwordNew || passwordNew === "") {
      const user = await Users.findOne({ email: req.params.id });
      if (passwordNew !== "") {
        const comparePassword = await bcyrbt.compare(password, user.password);
        if (!comparePassword) {
          return res.send("PASSWORD_ERROR");
        } else {
          const hashedPassword = await bcyrbt.hash(passwordNew, saltRounds);
          user.password = hashedPassword;
        }
      } else {
        user.phone = phone;
        user.image = image;
        user.company.color = color;
        user.company.phone = phoneCompany;
        user.company.name = nameCompany;
        user.company.image = imgCompany;
      }

      const SaveUser = await user.save();
      if (SaveUser) {
        return res.status(201).send("EDITED_SUCCESS");
      }
    } else {
      const user = await Users.findById(req.params.id);
      const bcryptRegex = /^\$2[ayb]\$[0-9]{2}\$([./0-9A-Za-z]{53})$/;

      if (password && !bcryptRegex.test(password)) {
        const hashedPassword = await bcyrbt.hash(password, saltRounds);
        user.password = hashedPassword;
      }

      if (passwordWallet && !bcryptRegex.test(passwordWallet)) {
        const hashedPasswordWallet = await bcyrbt.hash(
          passwordWallet,
          saltRounds
        );
        user.passwordWallet = hashedPasswordWallet;
      }
      user.firstName = name;
      user.email = email;
      user.phone = phone;
      user.validity = validity;
      user.image = image;
      const SaveUser = await user.save();
      if (SaveUser) {
        return res.status(201).send("EDITED_SUCCESS");
      }
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

exports.addUser = async (req, res) => {
  try {
    const { data: encryptedData } = req.body;

    const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, keyHash);
    const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
    const decryptedData = JSON.parse(decryptedText);

    const { name, validity, email, image, password, passwordWallet, phone } =
      decryptedData;

    const existingUser = await Users.findOne({ email });

    if (existingUser) {
      return res.status(200).send("USER_FOUND");
    } else {
      const hashedPassword = await bcyrbt.hash(password, saltRounds);
      const hashedPasswordWallet = await bcyrbt.hash(
        passwordWallet,
        saltRounds
      );

      const DataUser = {
        image,
        email,
        phone: phone || "N/A",
        firstName: name,
        secondName: "",
        password: hashedPassword,
        passwordWallet: hashedPasswordWallet,
        validity,
      };

      const NewUser = new Users(DataUser);
      await NewUser.save();
      return res.status(201).send("ADDED_SUCCESS");
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

exports.EditOrder = async (req, res) => {
  try {
    const { data: encryptedData } = req.body;

    const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, keyHash);
    const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
    const decryptedData = JSON.parse(decryptedText);

    const order = await Order.findById(decryptedData.orderId);
    const user = await Users.findOne({ email: order.markter });

    if (
      decryptedData.casesOrder[decryptedData.casesOrder.length - 1].case ===
      "تم الرفض"
    ) {
      for (const product of order.products) {
        const findProduct1 = await Products.findById(product.idProduct);

        if (findProduct1) {
          const findColor = findProduct1.details.find(
            (color) => color.color === product.colorProduct
          );

          const findSize = findColor.sizes.find(
            (size) =>
              size.size === product.sizeProduct &&
              size.city === product.cityProduct &&
              size.store === product.storeProduct
          );

          findSize.amount += product.amountProduct;

          await findProduct1.save();
        } else {
          const findProduct2 = await Products.findOne({
            "products._id": product.idProduct,
          });

          const childProduct = findProduct2.products.find(
            (p) => p._id.toString() === product.idProduct
          );

          const findColor = childProduct.details.find(
            (color) => color.color === product.colorProduct
          );

          const findSize = findColor.sizes.find(
            (size) =>
              size.size === product.sizeProduct &&
              size.city === product.cityProduct &&
              size.store === product.storeProduct
          );

          findSize.amount += product.amountProduct;

          await findProduct2.save();
        }
      }

      if (user.validity === "Markter") {
        user.wallet.find(
          (item) => item.orderId === decryptedData.orderId
        ).status = "Failed";
      }
    }

    order.casesOrder.push(...decryptedData.casesOrder);
    const saveOrder = await order.save();
    const saveUser = await user.save();

    if (saveOrder && saveUser) {
      return res.status(201).send("SAVE_SUSESS");
    }
  } catch (err) {
    return res.status(201).send("FALIED");
  }
};
