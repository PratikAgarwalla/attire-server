const express = require("express");
const { protect } = require("../controllers/authController");
const { createOrder, getOrders } = require("../controllers/orderController");

const router = express.Router();

router.post("/createOrder", protect, createOrder);
router.get("/getOrders", protect, getOrders);

module.exports = router;
