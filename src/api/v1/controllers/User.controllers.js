/* eslint-disable new-cap */
/* eslint-disable eqeqeq */
/* eslint-disable camelcase */
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const os = require("os");
const { v4: uuid } = require("uuid");
const { NONAME } = require("dns");
const { google } = require("googleapis");
const {
  server: { domain },
  staticFilesUrlRoute,
  showDevLogsAndResponse
} = require("../../../../config/appConfig");
const User = require("../models/User.model");
const { standardResponse } = require("../helpers");
const sendMail = require("./sendMail");

const { OAuth2 } = google.auth;

const client = new OAuth2(process.env.MAILING_SERVICE_CLIENT_ID);
const { CLIENT_URL } = process.env;
const errCatchResObjRetFn = (res, error) => {
  const { message } = error && error.errors && error.errors[0] ? error.errors[0] : "";
  let resObj = {
    res,
    isError: true,
    message: "",
    responseStatusCode: null,
    msg: message
  };
  resObj = showDevLogsAndResponse
    ? {
        ...resObj,
        err: error
      }
    : {
        ...resObj
      };
  return resObj;
};

function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

const createActivationToken = (payload) =>
  jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, {
    expiresIn: "5m"
  });

const createAccessToken = (payload) =>
  jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m"
  });

const createRefreshToken = (payload) =>
  jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d"
  });

const register = async (req, res) => {
  try {
    const { name, email, password, role, mobile_number, whatsapp_number, office_location, address, reporting_to } =
      req.body;

    if (!name || !email || !password || !mobile_number || !address) {
      return res.status(400).json({
        msg: "Please fill in all fields."
      });
    }
    const WhatsAppNumber = whatsapp_number || mobile_number;
    const Role = role || 0;
    if (!validateEmail(email)) {
      return res.status(400).json({
        msg: "Invalid emails."
      });
    }

    const user = await User.findOne({
      email
    });
    if (user) {
      return res.status(400).json({
        msg: "This email already exists."
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        msg: "Password must be at least 6 characters."
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const newUser = {
      name,
      email,
      password: passwordHash,
      mobile_number,
      whatsapp_number: WhatsAppNumber,
      role: Role,
      address,
      office_location,
      reporting_to
    };

    const activation_token = createActivationToken(newUser);

    const url = `${CLIENT_URL}/user/activate/${activation_token}`;
    // sendMail(email, url, "Verify your email address");

    res.json({
      msg: "Register Success! Please activate your email to start.",
      url
    });
  } catch (err) {
    return res.status(500).json({
      msg: err.message
    });
  }
};
const activateEmail = async (req, res) => {
  try {
    const { activation_token } = req.body;

    const user = jwt.verify(activation_token, process.env.ACTIVATION_TOKEN_SECRET);
    const { name, email, password, role, mobile_number, whatsapp_number, office_location, address, reporting_to } =
      user;

    const check = await User.findOne({
      email
    });
    if (check) {
      return res.status(400).json({
        msg: "This email already exists."
      });
    }

    const newUser = new User({
      name,
      email,
      password,
      mobile_number,
      whatsapp_number,
      role,
      address,
      office_location,
      reporting_to
    });

    await newUser.save();

    res.json({
      msg: "Account has been activated!"
    });
  } catch (err) {
    return res.status(500).json({
      msg: err.message
    });
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      email
    });
    if (!user) {
      return res.status(400).json({
        msg: "This email does not exist."
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        msg: "Password is incorrect."
      });
    }

    const refresh_token = createRefreshToken({
      id: user._id
    });
    res.cookie("refreshtoken", refresh_token, {
      httpOnly: true,
      path: "/api/v1/user/refresh_token",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
      msg: "Login success!"
    });
  } catch (err) {
    return res.status(500).json({
      msg: err.message
    });
  }
};
const getAccessToken = (req, res) => {
  try {
    const rf_token = req.cookies.refreshtoken;
    if (!rf_token) {
      return res.status(400).json({
        msg: "Please login now!"
      });
    }

    jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.status(400).json({
          msg: "Please login now!"
        });
      }

      const access_token = createAccessToken({
        id: user.id
      });
      res.json({
        access_token
      });
    });
  } catch (err) {
    return res.status(500).json({
      msg: err.message
    });
  }
};
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({
      email
    });
    if (!user) {
      return res.status(400).json({
        msg: "This email does not exist."
      });
    }

    const access_token = createAccessToken({
      id: user._id
    });
    const url = `${CLIENT_URL}/user/reset/${access_token}`;

    sendMail(email, url, "Reset your password");
    res.json({
      msg: "Re-send the password, please check your email."
    });
  } catch (err) {
    return res.status(500).json({
      msg: err.message
    });
  }
};
const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    console.log(password);
    const passwordHash = await bcrypt.hash(password, 12);

    await User.findOneAndUpdate(
      {
        _id: req.user.id
      },
      {
        password: passwordHash
      }
    );

    res.json({
      msg: "Password successfully changed!"
    });
  } catch (err) {
    return res.status(500).json({
      msg: err.message
    });
  }
};
const getUserInfor = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    res.json(user);
  } catch (err) {
    return res.status(500).json({
      msg: err.message
    });
  }
};
const getUsersAllInfor = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.json(users);
  } catch (err) {
    return res.status(500).json({
      msg: err.message
    });
  }
};
const logout = async (req, res) => {
  try {
    res.clearCookie("refreshtoken", {
      path: "/api/v1/user/refresh_token"
    });
    return res.json({
      msg: "Logged out."
    });
  } catch (err) {
    return res.status(500).json({
      msg: err.message
    });
  }
};
const updateUser = async (req, res) => {
  try {
    const { name, avatar } = req.body;
    await User.findOneAndUpdate(
      {
        _id: req.user.id
      },
      {
        name,
        avatar
      }
    );

    res.json({
      msg: "Update Success!"
    });
  } catch (err) {
    return res.status(500).json({
      msg: err.message
    });
  }
};
const updateUsersRole = async (req, res) => {
  try {
    const { role } = req.body;

    await User.findOneAndUpdate(
      {
        _id: req.params.id
      },
      {
        role
      }
    );

    res.json({
      msg: "Update Success!"
    });
  } catch (err) {
    return res.status(500).json({
      msg: err.message
    });
  }
};
const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);

    res.json({
      msg: "Deleted Success!"
    });
  } catch (err) {
    return res.status(500).json({
      msg: err.message
    });
  }
};
const googleLogin = async (req, res) => {
  try {
    const { tokenId } = req.body;

    const verify = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.MAILING_SERVICE_CLIENT_ID
    });

    const { email_verified, email, name, picture } = verify.payload;

    const password = email + process.env.GOOGLE_SECRET;

    const passwordHash = await bcrypt.hash(password, 12);

    if (!email_verified) {
      return res.status(400).json({
        msg: "Email verification failed."
      });
    }

    const user = await User.findOne({
      email
    });

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({
          msg: "Password is incorrect."
        });
      }

      const refresh_token = createRefreshToken({
        id: user._id
      });
      res.cookie("refreshtoken", refresh_token, {
        httpOnly: true,
        path: "/api/v1/user/refresh_token",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      res.json({
        msg: "Login success!"
      });
    } else {
      const newUser = new User({
        name,
        email,
        password: passwordHash,
        avatar: picture
      });

      await newUser.save();

      const refresh_token = createRefreshToken({
        id: newUser._id
      });
      res.cookie("refreshtoken", refresh_token, {
        httpOnly: true,
        path: "/api/v1/user/refresh_token",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      res.json({
        msg: "Login success!"
      });
    }
  } catch (err) {
    return res.status(500).json({
      msg: err.message
    });
  }
};
// const facebookLogin = async (req, res) => {
//     try {
//         const {accessToken, userID} = req.body

//         const URL = `https://graph.facebook.com/v2.9/${userID}/?fields=id,name,email,picture&access_token=${accessToken}`

//         const data = await fetch(URL).then(res => res.json()).then(res => {return res})

//         const {email, name, picture} = data

//         const password = email + process.env.FACEBOOK_SECRET

//         const passwordHash = await bcrypt.hash(password, 12)

//         const user = await Users.findOne({email})

//         if(user){
//             const isMatch = await bcrypt.compare(password, user.password)
//             if(!isMatch) return res.status(400).json({msg: "Password is incorrect."})

//             const refresh_token = createRefreshToken({id: user._id})
//             res.cookie('refreshtoken', refresh_token, {
//                 httpOnly: true,
//                 path: '/user/refresh_token',
//                 maxAge: 7*24*60*60*1000 // 7 days
//             })

//             res.json({msg: "Login success!"})
//         }else{
//             const newUser = new Users({
//                 name, email, password: passwordHash, avatar: picture.data.url
//             })

//             await newUser.save()

//             const refresh_token = createRefreshToken({id: newUser._id})
//             res.cookie('refreshtoken', refresh_token, {
//                 httpOnly: true,
//                 path: '/api/v1/user/refresh_token',
//                 maxAge: 7*24*60*60*1000 // 7 days
//             })

//             res.json({msg: "Login success!"})
//         }

//     } catch (err) {
//         return res.status(500).json({msg: err.message})
//     }
// }

const userDeletionReason = async (req, res) => {
  const message = [
    "Not working with Qloron anymore",
    "User already exists with another email/ phone number",
    "Wrong info added",
    "Is on Paternal/ Maternal/ Sabbatical Leave",
    "Other"
  ];
  standardResponse({
    res,
    isError: false,
    data: message,
    responseStatusCode: 200,
    successCode: 200
  });
};

const user_list = async (req, res) => {
  const { pageNo } = req.query;
  const user = await User.find(
    {},
    {
      name: 1,
      email: 1,
      mobile_number: 1,
      whatsapp_number: 1,
      office_location: 1,
      address: 1,
      reporting_to: 1
    }
  )
    .limit(20)
    .skip((pageNo - 1) * 20);
  if (user.length === 0) {
    return standardResponse({
      res,
      isError: true,
      message: "User Data Out Of Range!",
      responseStatusCode: 416,
      successCode: 204
    });
  }
  try {
    standardResponse({
      res,
      isError: false,
      message: "Data Fetch Successfully!",
      data: user,
      responseStatusCode: 200,
      successCode: 200
    });
  } catch (error) {
    standardResponse({
      ...errCatchResObjRetFn(res, error),
      message: error.message,
      responseStatusCode: 422,
      errorCode: 409
    });
  }
};

module.exports = {
  register,
  activateEmail,
  login,
  getAccessToken,
  forgotPassword,
  resetPassword,
  getUserInfor,
  getUsersAllInfor,
  logout,
  updateUser,
  updateUsersRole,
  deleteUser,
  googleLogin,
  // facebookLogin,
  userDeletionReason,
  user_list
};
