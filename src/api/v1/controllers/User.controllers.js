/* eslint-disable new-cap */
/* eslint-disable eqeqeq */
/* eslint-disable camelcase */
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const os = require("os");
const { v4: uuid } = require("uuid");
const { NONAME } = require("dns");
const {
  server: { domain },
  staticFilesUrlRoute,
  showDevLogsAndResponse
} = require("../../../../config/appConfig");
const User = require("../models/User.model");
const { standardResponse } = require("../helpers");

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

const addUser = async (req, res) => {
  try {
    const {
      username,
      password: plainpassword,
      personal_email,
      mobile_number,
      whatsapp_number,
      office_location,
      address,
      reporting_to
    } = req.body;

    const password = await bcrypt.hash(plainpassword, 10);
    let WhatsAppNumber = whatsapp_number;
    if (WhatsAppNumber === undefined) {
      WhatsAppNumber = mobile_number;
    }
    const result = await User.create({
      username,
      password,
      personal_email,
      mobile_number,
      whatsapp_number: WhatsAppNumber,
      office_location,
      address,
      reporting_to
    });

    standardResponse({
      res,
      isError: false,
      message: "User Created Successfully!",
      responseStatusCode: 201,
      successCode: 200,
      data: result
    });
  } catch (error) {
    if (error.message.includes("shorter than the minimum allowed length")) {
      standardResponse({
        ...errCatchResObjRetFn(res, error),
        message: "Username Is Too Short, Atleast 3 Characters!",
        responseStatusCode: 422,
        errorCode: 409
      });
    }
    if (error.code === 11000) {
      standardResponse({
        ...errCatchResObjRetFn(res, error),
        message: "Email, Presonal Number or WhatsApp Number Is Already Be In Used!",
        responseStatusCode: 422,
        errorCode: 409
      });
    } else {
      console.log(error);
    }
  }
};

const login = async (req, res) => {
  try {
    const { personal_email, password: plainpassword } = req.body;
    const user =
      (await User.findOne({
        personal_email
      })) || undefined;
    if (!user) {
      return standardResponse({
        res,
        isError: true,
        message: "User Not Found!",
        responseStatusCode: 401,
        errorCode: 401
      });
    }
    if (await bcrypt.compare(plainpassword, user.password)) {
      const token = jwt.sign(
        {
          id: user.id
        },
        process.env.SECRETKEYJWT
      );
      standardResponse({
        res,
        isError: false,
        data: {
          token
        },
        message: "User Logged In Successfully",
        responseStatusCode: 202,
        successCode: 200
      });
    } else {
      standardResponse({
        res,
        isError: true,
        message: "Password Does Not Match",
        responseStatusCode: 203,
        errorCode: 406
      });
    }
  } catch (error) {
    standardResponse({
      ...errCatchResObjRetFn(res, error),
      message: error.message,
      responseStatusCode: 422,
      errorCode: 409
    });
  }
};

const profile = async (req, res) => {
  const { username } = req;
  const { personal_email } = req;
  standardResponse({
    res,
    isError: false,
    message: "Data Fetch Successfully!",
    data: {
      username,
      personal_email
    },
    responseStatusCode: 200,
    successCode: 200
  });
};

const userDeletion_reason_dropdown_list = async (req, res) => {
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
      username: 1,
      personal_email: 1,
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
  addUser,
  login,
  profile,
  userDeletion_reason_dropdown_list,
  user_list
};
