const express = require("express");
const router = express.Router();
const usercontroller = require("../controller/message");
const middleware = require("../middleware/auth");

router.post("/message", middleware.authenticate, usercontroller.chat);

module.exports = router;
