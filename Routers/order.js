const express = require("express");
const protect = require("../middleware/authMiddleware");

const {
  createOrder,
  getAllOrder,
  getSingleOrder,
  marderOrderAsDelivered,
} = require("../Controllers/order");

router = express.Router();

router.post("/order", createOrder);
router.post("/getorders", protect, getAllOrder);
router.post("/getorder", protect, getSingleOrder);
router.post("/deliver", protect, marderOrderAsDelivered);
module.exports = router;
