const jwt = require("jsonwebtoken");
const Users = require("../models/User.model");

const auth = (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token) {
      return res.status(400).json({
        msg: "Invalid Authentication."
      });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, tokenData) => {
      if (err) {
        return res.status(400).json({
          msg: "Invalid Authentication."
        });
      }

      req.user = tokenData;
      next();
    });
  } catch (err) {
    return res.status(500).json({
      msg: err.message
    });
  }
};

const authPanelUser = async (req, res, next) => {
  try {
    const user = await Users.findOne({
      _id: req.user.id
    });

    if (user.role !== 1 && user.role !== 2 && user.role !== 3) {
      return res.status(500).json({
        msg: "Panel User access denied."
      });
    }
    req.user.role = user.role;

    next();
  } catch (err) {
    return res.status(500).json({
      msg: err.message
    });
  }
};

const authAdmin = async (req, res, next) => {
  try {
    const user = await Users.findOne({
      _id: req.user.id
    });

    if (user.role !== 2 && user.role !== 3) {
      return res.status(500).json({
        msg: "Admin resources access denied."
      });
    }
    req.user.role = user.role;
    next();
  } catch (err) {
    return res.status(500).json({
      msg: err.message
    });
  }
};

const authSuperAdmin = async (req, res, next) => {
  try {
    const user = await Users.findOne({
      _id: req.user.id
    });

    if (user.role !== 3) {
      return res.status(500).json({
        msg: "Super Admin resources access denied."
      });
    }
    req.user.role = user.role;
    next();
  } catch (err) {
    return res.status(500).json({
      msg: err.message
    });
  }
};

module.exports = {
  auth,
  authAdmin,
  authPanelUser,
  authSuperAdmin
};
