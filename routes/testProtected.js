const express = require("express");
const { protect, checkRole } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/admin-only", protect, checkRole(["admin"]), (req, res) => {
  res.send("You are an admin");
});

module.exports = router;
