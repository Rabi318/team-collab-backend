const express = require("express");
const {
  registerUser,
  loginUser,
  getMe,
  findUserByEmail,
  updateProfile,
  changePassword,
} = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");
const router = express.Router();

router.get("/me", getMe);
router.get("/users", protect, findUserByEmail);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/update-profile", protect, upload.single("avatar"), updateProfile);
router.put("/change-password", protect, changePassword);

module.exports = router;
