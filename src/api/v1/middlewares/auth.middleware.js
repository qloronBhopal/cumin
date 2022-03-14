const jwt = require("jsonwebtoken");
const { secretKeyJwt, showDevLogsAndResponse } = require("../../../../config/appConfig");
const { standardResponse } = require("../helpers");
const User = require("../models/User.model");

const authmid = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return standardResponse({
        res,
        isError: true,
        message: "Auth Token Require",
        responseStatusCode: 401,
        errorCode: 401
      });
    }
    const authheader = req.headers.authorization;
    const bearertoken = authheader.split(" ");
    const token = bearertoken[1];
    if (!token) {
      return standardResponse({
        res,
        isError: true,
        message: "Auth token require",
        responseStatusCode: 401,
        errorCode: 401
      });
    }
    jwt.verify(token, secretKeyJwt, (err, payload) => {
      if (err) {
        return standardResponse({
          res,
          isError: true,
          message: "You Dont Have access!",
          responseStatusCode: 409,
          errorCode: 409
        });
      }
      req._id = payload.id;
    });
    const isread = await User.findOne({
      _id: req._id
    });
    if (!isread) {
      return standardResponse({
        res,
        isError: true,
        message: "user not found",
        responseStatusCode: 404,
        errorCode: 404
      });
    }
    req.personal_email = isread.personal_email;
    req.username = isread.username;
    // req.prfilepic = isread.profilepic

    const isupdate = await User.findOneAndUpdate(
      {
        _id: req._id
      },
      {
        last_active: new Date()
      },
      {
        new: true
      }
    );
    if (!isupdate) {
      return standardResponse({
        res,
        isError: true,
        message: "unable to update",
        responseStatusCode: 500,
        errorCode: 500
      });
    }
    next();
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  authmid
};
