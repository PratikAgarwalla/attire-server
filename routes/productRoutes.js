const express = require("express");
const {
  createProduct,
  getProduct,
  getProducts,
  topPicks,
  getManyProducts,
} = require("../controllers/productController");

const router = express.Router();

router.route("/").post(createProduct).get(getManyProducts);
router.route("/:id").get(getProduct);
router
  .route("/collection/:category?/:mainCategory?/:subCategory?")
  .get(getProducts);

// top picks route
router.route("/topPicks/:category?/:mainCategory?").get(topPicks);

module.exports = router;
