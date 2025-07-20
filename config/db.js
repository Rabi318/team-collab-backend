const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    // console.log(process.env.MONGO_URL);
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Database is connected");
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;
