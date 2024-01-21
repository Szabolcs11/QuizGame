const express = require("express");
const router = express.Router({ mergeParams: true });
var path = require("path");

router.get("/", (req, res) => {
  var options = {
    root: path.join("public/files"),
  };
  var fileName = req.params.key;
  res.sendFile(fileName, options);
});

module.exports = router;
