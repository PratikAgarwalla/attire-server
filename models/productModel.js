const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Product must have a title"],
    trim: true,
  },
  name: {
    type: String,
    required: [true, "Product must have a name"],
    trim: true,
  },
  category: {
    type: String,
    required: [true, "Product must have a category"],
    enum: {
      values: ["mens", "womens", "kids", "boardsports", "wetsuits"],
      message:
        "A product must either belong to mens, womens, kids, wetsuits or boardsports",
    },
  },
  mainCategory: {
    type: String,
    required: [true, "Product must have a main category"],
  },
  subCategory: {
    type: String,
    required: [true, "Product must have a sub category"],
  },
  imageCount: {
    type: Number,
    default: 5,
  },
  sizes: [
    {
      size: {
        type: String,
        required: [true, "Each size must have a size value"],
        enum: {
          values: ["XS", "S", "M", "L", "XL", "XXL"],
          message: "Size must be one of XS, S, M, L, XL, XXL",
        },
      },
      quantity: {
        type: Number,
        required: [true, "Each size must have a quantity"],
        min: [0, "Quantity cannot be less than 0"],
      },
    },
  ],
  new: {
    type: Boolean,
    default: false,
  },
  sale: {
    type: Boolean,
    default: false,
  },
  price: {
    type: Number,
    required: [true, "Product must have a price"],
    min: [0.01, "Price must be greater than 0"],
  },
  discount: {
    type: Number,
    default: 0,
    max: [99.99, "Discount cannot be 100 percentage"],
    min: [0.0, "Discount cannot be less than 0"],
  },
  description: {
    type: String,
    required: [true, "Product must have a description"],
  },
  info: {
    type: [String],
    required: [true, "Product must have additional info"],
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
