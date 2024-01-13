const express = require("express");
const router = express.Router();

router.use("/authenticate", require("./authenticate.js"));
router.use("/register", require("./register.js"));

module.exports = router;
