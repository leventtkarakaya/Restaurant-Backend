const express = require("express");
const {
  register,
  authControllers,
  loginControllers,
  verifyOtpControllers,
  updateUserProfile,
} = require("../Controllers/user.js");
const protect = require("../middleware/authMiddleware.js");

router = express.Router();

router.post("/register", register);
router.post("/get-user", protect, authControllers);
router.post("/login", loginControllers);
router.post("/verifyotp", verifyOtpControllers);
router.put("/profileUpdate", protect, updateUserProfile);
module.exports = router;
