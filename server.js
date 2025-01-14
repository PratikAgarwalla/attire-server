const mongoose = require("mongoose");

const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const app = require("./app");

// DATABASE CONNECTION
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASS  
);

mongoose.connect(DB).then(() => {
  console.log("Database connected successfully");
});

// SERVER STARTED
const PORT = process.env.PORT || 8000;
app.listen(8000, (err) => {
  console.log("Server started successfully");
});
