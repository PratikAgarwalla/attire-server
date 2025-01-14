const express = require("express");
const path = require("path");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");

const productRouter = require("./routes/productRoutes");
const authRouter = require("./routes/authRoutes");
const cartRouter = require("./routes/cartRoutes");
const addressRouter = require("./routes/addressRoutes");
const orderRouter = require("./routes/orderRoutes");
const globalErrorHandler = require("./controllers/errorController");
const cookieParser = require("cookie-parser");

const app = express();

// MIDDLEWARE

// 0. CORS
const allowedOrigins = [
  "http://localhost:5173",
  "https://attire-clothing.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// 1. Security middleware
app.use(helmet());

// 2. Limit the number of request from an IP address
// const limiter = rateLimit({
//   limit: 200,
//   windowMs: 60 * 60 * 1000,
//   message: "Too many request from the same IP address. Try after an hour",
// });
// app.use(limiter);

// 3. To make body part of the req object
app.use(express.json());
// 4. To allow cookies to be accessed through req object
app.use(cookieParser());

// 5. Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// 6. Data sanitization against XSS - cross site scripting
app.use(xss());

// ROUTES
app.use("/api/v1/products", productRouter);
app.use("/api/v1/users", authRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/address", addressRouter);
app.use("/api/v1/order", orderRouter);

// Set Cross-Origin-Resource-Policy header
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
});

// 7. Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// GLOBAL ERROR HANDLER
app.use(globalErrorHandler);

module.exports = app;
