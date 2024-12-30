const Product = require("../models/productModel");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/CatchAsync");

// CREATE NEW PRODUCT
exports.createProduct = catchAsync(async (req, res, next) => {
  const product = await Product.create(req.body);

  if (!product) {
    return next(new AppError("Error while creating a new product", 400));
  }

  res.status(200).json({
    status: "success",
    data: {
      product,
    },
  });
});

// GET ONE PRODUCT BASED ON THE ID
exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new AppError("Cannot find product with this ID", 400));
  }

  res.status(200).json({
    status: "success",
    data: {
      product,
    },
  });
});

exports.getManyProducts = catchAsync(async (req, res, next) => {
  const { ids } = req.query;

  if (!ids) {
    return next(new AppError("Please provide product IDs", 400));
  }

  const idsArray = ids.split(",").map((id) => id.trim());

  if (idsArray.length === 0) {
    return next(
      new AppError("Please provide a valid array of product IDs", 400)
    );
  }

  const products = await Product.find({
    _id: { $in: idsArray },
  });

  if (!products || products.length === 0) {
    return next(new AppError("No products found for the provided IDs", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      products,
    },
  });
});

// GET PRODUCTS
exports.getProducts = catchAsync(async (req, res, next) => {
  const { category, mainCategory, subCategory } = req.params;

  const filter = {};

  if (category) filter.category = category;

  if (mainCategory) filter.mainCategory = mainCategory;

  if (subCategory) filter.subCategory = subCategory;

  const products = await Product.find(filter);

  if (!products) {
    return next(new AppError("Cannot find products", 400));
  }

  res.status(200).json({
    status: "success",
    data: {
      products,
    },
  });
});

exports.topPicks = catchAsync(async (req, res, next) => {
  const { category, mainCategory } = req.params;
  const limit = Number(req.query.limit) || 5;

  const query = {};

  if (category) query.category = category;
  if (mainCategory) query.mainCategory = mainCategory;

  const products = await Product.find(query).sort({ price: -1 }).limit(limit);

  if (!products) {
    return next(new AppError("Cannot find top products", 400));
  }

  res.status(200).json({
    status: "success",
    data: {
      products,
    },
  });
});
