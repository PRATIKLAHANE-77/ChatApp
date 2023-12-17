const express = require("express");
const router = express.Router();
const adminController = require("../controller/admin");
const middleware = require("../middleware/auth");

router.post("/make-admin", middleware.authenticate, adminController.makeadmin);
router.post("/remove-admin", middleware.authenticate,adminController.removeAdmin);



module.exports = router;
