const mongoose = require("mongoose");
const { userDefaultProfilePicUrl } = require("../../../../config/db_related_config");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name: Required!"],
      trim: true,
      minLength: [3, "name: Min Length Required 3!"],
      maxLength: [50, "name: Max Length Required 50!"]
    },
    email: {
      type: String,
      required: [true, "Email: Required!"],
      lowercase: true,
      trim: true,
      minLength: [6, "email: Min Length Required 6!"],
      maxLength: [80, "email: Max Length Required 80!"],
      unique: true,
      validate: [(email) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email), "Invalid Email!"],
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Invalid Email!"]
    },
    password: {
      type: String,
      required: [true, "Password: required!"],
      minLength: [6, "password: Min Length Required 6!"],
      maxLength: [700, "password: Max Length Required 700!"]
    },
    role: {
      type: Number,
      enum: {
        values: [0, 1, 2, 3], // 0-user, 1-panel_user, 2-admin, 3-super-admin
        message: "{VALUE} is not supported!"
      },
      default: 0
    },
    status: {
      type: Number,
      Enum: {
        values: [0, 1], // 0 = Inactive, 1 = Active
        required: "{VALUE} is not supported!"
      },
      default: 1
    },
    avatar: {
      type: String,
      default: userDefaultProfilePicUrl,
      trim: true,
      validate: [
        (url) => ["pdf", "jpg", "png"].indexOf("asdas.png".split(".").pop().toLowerCase()) !== -1,
        "Unsupported File Extension!"
      ],
      minLength: [4, "avatar: Min Length Required 4!"],
      maxLength: [700, "avatar: Max Length Required 700!"]
    },
    mobile_number: {
      type: Number,
      required: [true, "Mobile Number Is Required!"],
      minLength: [10, "Invalid Mobile Number!"],
      maxLength: [13, "Invalid Mobile Number!"],
      unique: true
    },
    whatsapp_number: {
      type: Number,
      required: false,
      minLength: [10, "Invalid Mobile Number!"],
      maxLength: [13, "Invalid Mobile Number!"],
      unique: true
    },
    office_location: {
      type: Object,
      values: {
        branch: "",
        type: ""
      },
      required: false
    },
    address: {
      type: Object,
      required: true,
      values: {
        house_no: "",
        city: "",
        state: "",
        country: "",
        address_completed: "",
        pincode: {
          type: "number"
        },
        address_type: {
          type: Number,
          enum: [0, 1] // 0-Office_Address, 1-Home_Address
        }
      }
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
