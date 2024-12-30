const Order = require("../models/orderModel");
const User = require("../models/userModel");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/CatchAsync");

exports.createOrder = catchAsync(async (req, res, next) => {
  // Fetch the user from the database
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new AppError("No user found!", 404));
  }

  // Extract order details from the request body
  const { products, addressId } = req.body;

  if (!products || products.length === 0) {
    return next(new AppError("Order must contain at least one product.", 400));
  }

  if (!addressId) {
    return next(new AppError("Address ID is required.", 400));
  }

  // Create a new order
  const order = await Order.create({
    products,
    addressId,
    date: new Date(),
    status: "placed",
  });

  // Add the order ID to the user's orders array
  user.orders.push(order._id);
  user.cart = [];
  await user.save({ validateBeforeSave: false });

  // Respond to the client
  res.status(200).json({
    status: "success",
    message: "Order created successfully",
    data: {
      user,
    },
  });
});

exports.getOrders = catchAsync(async (req, res, next) => {
  // Fetch the user from the database using the ID from the request (authenticated user)
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new AppError("No user found with that ID", 404));
  }

  // Fetch all orders for the user and populate the product details
  const orders = await Order.find({ _id: { $in: user.orders } })
    .populate({
      path: "products.productId", // Populating the product details
      select: "category mainCategory subCategory", // Select the fields you need
    })
    .sort({ date: -1 }); // Sort orders by the latest date

  if (orders.length === 0) {
    return next(new AppError("No orders found for this user", 404));
  }

  // Respond with the user's orders
  res.status(200).json({
    status: "success",
    data: { orders },
  });
});
