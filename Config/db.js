const mongoose = require("mongoose");

const dotenv = require("dotenv");

dotenv.config();

const MONGU_URI = process.env.MONGU_URIAPI;
const db = () => {
  mongoose
    .connect(MONGU_URI)
    .then(() => {
      console.log("🚀 ~ mongoose.connect ~ success");
    })
    .catch((err) => {
      console.log("🚀 ~ mongoose.connect ~ err:", err);
    });
};

module.exports = db;
