const express = require("express");
const router = express.Router();
const Cities = require("../controllers/citiesController");

router.get("/", Cities.getCities);
router.get("/getProductsWithStore/:id", Cities.getProductsWithStore);
router.get("/:id", Cities.getCity);
router.post("/addcity", Cities.addCity);
router.post("/edit/:id", Cities.editCity);
router.post("/convertProducts", Cities.ConvertProducts);

module.exports = router;
