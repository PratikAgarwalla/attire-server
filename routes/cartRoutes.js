const express = require("express");
const { protect } = require("../controllers/authController");
const {
  addItem,
  updateCart,
  clearCart,
} = require("../controllers/cartController");

const router = express.Router();

router.post("/addItem", protect, addItem);
router.patch("/updateCart", protect, updateCart);
router.delete("/clearCart", protect, clearCart);

module.exports = router;
