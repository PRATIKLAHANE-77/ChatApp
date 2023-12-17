const express = require("express");
const router = express.Router();
const usercontroller = require("../controller/user");

router.post("/signup", usercontroller.signup);
router.post("/login", usercontroller.login);
router.get("/allusers",usercontroller.getallusers);
router.get("/remaining-users",usercontroller.remainingUsers)
router.post("/add-new-users", usercontroller.addNewUsers)

module.exports = router;
