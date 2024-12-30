const User = require("../models/userModel");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/CatchAsync");

exports.addItem = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const cartItems = user.cart;
  const { productId, size, quantity, price } = req.body;

  const itemExists = cartItems.some(
    (item) =>
      item.productId.toString() === productId.toString() && item.size === size
  );

  if (itemExists) {
    return next(new AppError("This item is already in the cart", 400));
  }

  user.cart.push({ productId, size, quantity, price });
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: "success",
    message: "Item added to cart successfully",
    data: {
      user,
    },
  });
});

exports.updateCart = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const { cart } = req.body;

  if (!Array.isArray(cart)) {
    return next(
      new AppError("Invalid cart format. Must be an array of cart items.", 400)
    );
  }

  user.cart = cart;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: "success",
    message: "Cart updated successfully",
    data: {
      user,
    },
  });
});

exports.clearCart = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  user.cart = [];
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: "success",
    message: "Cart cleared successfully",
    data: {
      user,
    },
  });
});
