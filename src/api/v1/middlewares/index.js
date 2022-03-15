const { auth, authAdmin } = require("./auth.middleware");
const { uploadImage } = require("./uploadImage.middleware");

module.exports = {
  auth,
  authAdmin,
  uploadImage
};
