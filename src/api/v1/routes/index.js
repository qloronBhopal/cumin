const router = require("express").Router();

router.use("/user", require("./User.routes"));

module.exports = router;
