const mongoose = require("mongoose");
require("dotenv").config();

module.exports = {
  connect: () => {
    try {
      mongoose.connect(process.env.DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      console.log("Db_Connected_Successfully");
    } catch (error) {
      console.log("Db_Connection_Err: ", error.message);
    }
  }
};
