const router = require("express").Router();
const { userControllers } = require("../controllers");
const { authmid } = require("../middlewares");

router.post("/signin", userControllers.login);
router.post("/signup", userControllers.addUser);
router.post("/profile", authmid, userControllers.profile);
router.post("/userDeletion_reason_dropdown_list", authmid, userControllers.userDeletion_reason_dropdown_list);
router.post("/userlist", userControllers.user_list);
module.exports = router;
