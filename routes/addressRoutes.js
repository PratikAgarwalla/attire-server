const express = require("express");
const { protect } = require("../controllers/authController");
const {
  addAddress,
  updateAddress,
} = require("../controllers/addressController");

const router = express.Router();

router.post("/addAddress", protect, addAddress);
router.patch("/updateAddress", protect, updateAddress);

module.exports = router;
