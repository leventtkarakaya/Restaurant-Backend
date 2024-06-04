const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [validator.isEmail, "Please provide email"],
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
    passwordConfrim: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
      validate: {
        validator: function (e) {
          return e === this.password;
        },
        message: "Password are not match",
      },
    },
    isVerified: {
      type: Boolean,
      default: false,
      required: true,
    },
    otp: {
      type: Number,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    district: {
      type: String,
      required: false,
    },
    city: {
      type: String,
      required: false,
    },
    country: {
      type: String,
      required: false,
    },
    zipCode: {
      type: String,
      required: false,
    },
    profileImage: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);
