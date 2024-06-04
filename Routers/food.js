const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  createFood,
  getAllFoods,
  foodDetails,
  getNewFoods,
  getFoodDisctinct,
  getTopRating,
} = require("../Controllers/food");
router = express.Router();

router.post("/admin/addfood", protect, createFood);
router.get("/admin/getAllFoods", getAllFoods);
router.get("/admin/getFood/:id", foodDetails);
router.get("/admin/getNewFoods", getNewFoods);
router.get("/admin/speacilFoods", getFoodDisctinct);
router.get("/admin/getTopRating", getTopRating);
module.exports = router;
