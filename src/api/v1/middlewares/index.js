const { auth, authAdmin, authPanelUser, authSuperAdmin } = require("./auth.middleware");
const { uploadImage } = require("./uploadImage.middleware");

module.exports = {
  auth,
  authAdmin,
  authPanelUser,
  authSuperAdmin,
  uploadImage
};
