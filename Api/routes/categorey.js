const express = require("express");
const router = express.Router();
const Categories = require("../controllers/categoryController");

router.get("/", Categories.getCategories);
router.get("/:id", Categories.getCategory);
router.post("/addcategory", Categories.addcategory);
router.post("/edit/:id", Categories.editCategory);

module.exports = router;
