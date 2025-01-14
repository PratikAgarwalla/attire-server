const User = require("../models/userModel");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/CatchAsync");

exports.addAddress = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const address = req.body.address;

  if (!address || typeof address !== "object") {
    return next(new AppError("Invalid address format", 400));
  }

  user.addresses.push(address);
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: "success",
    message: "New address added successfully",
    data: {
      user,
    },
  });
});

exports.updateAddress = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  console.log(req.body);

  const addressList = req.body.address;
  if (!addressList || !Array.isArray(addressList)) {
    return next(new AppError("Invalid address list format", 400));
  }

  user.addresses = addressList;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: "success",
    message: "Addresses updated successfully",
    data: {
      user,
    },
  });
});
