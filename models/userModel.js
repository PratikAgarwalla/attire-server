const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: validator.isEmail,
      message: "Please provide a valid email",
    },
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    match: [
      /^\+91\d{10}$|^\d{10}$/,
      "Please enter a valid phone number (either +91 followed by 10 digits or 10 digits without a country code)",
    ],
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    required: [true, "Gender is required"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters long"],
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, "Confirm password is required"],
    validate: {
      validator: function (value) {
        return value === this.password;
      },
      message: "Passwords do not match",
    },
  },
  passwordChangedAt: {
    type: Date,
  },
  passwordResetToken: {
    type: String,
  },
  passwordResetExpires: {
    type: Date,
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  addresses: [
    {
      name: {
        type: String,
        required: [true, "Name is required for the address"],
      },
      phone: {
        type: String,
        required: [true, "Phone number is required for the address"],
        match: [
          /^\+91\d{10}$|^\d{10}$/,
          "Please enter a valid phone number (either +91 followed by 10 digits or 10 digits without a country code)",
        ],
      },
      country: {
        type: String,
        required: [true, "Country is required"],
        default: "India",
      },
      state: {
        type: String,
        required: [true, "State is required"],
      },
      pincode: {
        type: String,
        required: [true, "Pincode is required"],
      },
      city: {
        type: String,
        required: [true, "City or district is required"],
      },
      houseno: {
        type: String,
        required: [true, "House number is required"],
      },
      street: {
        type: String,
        required: [true, "Street is required"],
      },
      landmark: {
        type: String,
        required: [true, "Landmark is required"],
      },
    },
  ],
  cart: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product", // Assuming there's a Product model
        required: true,
      },
      size: {
        type: String,
        required: [true, "Size is required"], // Ensure size is provided
      },
      quantity: {
        type: Number,
        required: [true, "Quantity is required"],
        min: [1, "Quantity must be at least 1"], // Ensure quantity is at least 1
      },
      price: {
        type: Number,
        required: [true, "Price is required"],
      },
    },
  ],
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order", // Reference to the Order model
    },
  ],
});

//  INSTANCE METHOD
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.passwordChangedAfter = function (timeStamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      new Date(this.passwordChangedAt).getTime() / 1000
    );

    return timeStamp < changedTimeStamp;
  }

  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = new Date().getTime() + 10 * 60 * 1000;

  return resetToken;
};

// MIDDLEWARE -> DOCUMENT | CREATE OR SAVE
// TO ENCRYPT PASSWORD
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
