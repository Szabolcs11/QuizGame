const express = require("express");
const router = express.Router();

router.use("/upload", require("./fileUpload.js"));
router.use("/:key", require("./getFile.js"));

module.exports = router;
