const express = require("express");
const router = express.Router();
const groupController = require("../controller/group");
const middleware = require("../middleware/auth");

router.post("/createGroup", middleware.authenticate, groupController.creategroups);
router.get("/receivegrpmessages/:grpid", middleware.authenticate, groupController.groupmessages);
router.get("/usergroups", middleware.authenticate, groupController.usergroups);


module.exports = router;
