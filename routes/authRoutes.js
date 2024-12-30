const express = require("express");
const {
  getUser,
  signup,
  login,
  protect,
  forgotPassword,
  resetPassword,
  updatePassword,
  updateUser,
} = require("../controllers/authController");

const router = express.Router();

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/forgotPassword").post(forgotPassword);
router.route("/resetPassword/:token").post(resetPassword);
router.route("/updatePassword").patch(protect, updatePassword);
router.route("/updateUser").patch(protect, updateUser);

module.exports = router;
