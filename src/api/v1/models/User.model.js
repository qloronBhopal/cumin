const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 40
    },
    personal_email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      minlength: 6,
      maxlength: 80
    },
    password: {
      type: String,
      required: true
    },
    profile_picture: {
      type: String,
      required: false
    },
    mobile_number: {
      type: Number,
      required: true,
      minlength: 10,
      unique: true
    },
    whatsapp_number: {
      type: Number,
      required: false,
      minlength: 10
    },
    office_location: {
      type: Object,
      required: false
    },
    address: {
      type: String,
      required: true
    },
    reporting_to: {
      type: String,
      required: false
    },
    last_login: {
      type: Date,
      required: false
    },
    last_active: {
      type: Date,
      required: false
    },
    status: {
      type: String,
      enum: {
        values: ["1", "0"],
        message: "{VALUE} is not supported!"
      },
      default: "1"
    },
    deletion_reason: {
      type: String,
      required: false
    }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
