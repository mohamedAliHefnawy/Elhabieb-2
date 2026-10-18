const express = require("express");
const router = express.Router();
const Users = require("../controllers/userController");

router.get("/", Users.getUsers);
router.get("/getUser/:id", Users.getUser);
router.get("/getWalletUser/:id", Users.getWalletUser);
router.get("/getClients", Users.getClients);
router.get("/getMarkters", Users.getMarkters);
router.get("/getAdmins", Users.getAdmins);
router.get("/getEmployes", Users.getEmployes);
router.get("/geDeliveries", Users.getDeliveries);
router.post("/register", Users.registerUser);
router.post("/login", Users.loginUser);
router.post("/loginWallet", Users.loginWallet);
router.post("/loginByGoogle", Users.loginUserByGoogle);
router.post("/editUser/:id", Users.editUser);
router.post("/addUser", Users.addUser);
router.post("/editOrder", Users.EditOrder);

module.exports = router;
