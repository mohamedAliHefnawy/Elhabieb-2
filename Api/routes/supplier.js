const express = require("express");
const router = express.Router();
const Suppliers = require("../controllers/supplierController");

router.get("/", Suppliers.getSuppliers);
router.get("/:id", Suppliers.getSupplier);
router.get("/invoices/:id", Suppliers.getInvoices);
router.post("/addsupplier", Suppliers.addSupplier);
router.post("/edit/:id", Suppliers.editSupplier);

module.exports = router;
