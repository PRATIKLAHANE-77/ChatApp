const express = require("express");
const router = express.Router();
const usercontroller = require("../controller/user");

router.post("/signup", usercontroller.signup);
router.post("/login", usercontroller.login);
router.get("/allusers",usercontroller.getallusers);

module.exports = router;
