const fs = require("fs");

const removeTmp = (path) => {
  fs.unlink(path, (err) => {
    if (err) throw err;
  });
};

const uploadImage = async (req, res, next) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({
        msg: "No Files Were Uploaded!"
      });
    }

    const { file } = req.files;

    if (file.size > 1024 * 1024) {
      removeTmp(file.tempFilePath);
      return res.status(400).json({
        msg: "File Size Too Large!"
      });
    } // 1mb

    if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/png") {
      removeTmp(file.tempFilePath);
      return res.status(400).json({
        msg: "File Format Is Incorrect!"
      });
    }

    next();
  } catch (err) {
    return res.status(500).json({
      msg: err.message
    });
  }
};

module.exports = {
  uploadImage
};
