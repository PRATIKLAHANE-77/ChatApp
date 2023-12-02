const express = require("express");
const router = express.Router();
const usercontroller = require("../controller/message");
const middleware = require("../middleware/auth");

router.post("/send-message", middleware.authenticate, usercontroller.sendmessage);
router.get("/receive-message", middleware.authenticate, usercontroller.receivemessage);

module.exports = router;
