const mongoose = require("mongoose");
require("dotenv").config();

mongoose
  .connect("mongodb://localhost:27017/sortboxs")
  .then(() => {
    console.log("Database is Connected!");
  })
  .catch((err) => {
    console.log(err);
  });
