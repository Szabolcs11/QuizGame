const express = require("express");
const router = express.Router();
const { Authenticate } = require("../../modules/authenticate/authenticate.js");
const upload = require("../../modules/utils/uploadfile/index.js");

router.use(Authenticate);
router.post("/", upload.single("file"), async (req, res) => {
  return res.status(200).json({
    success: true,
    filename: req.file.filename,
  });
});

module.exports = router;
