const express = require("express");
const router = express.Router();
const { Authenticate } = require("../../modules/authenticate/authenticate.js");

router.use(Authenticate);
router.get("/", async (req, res) => {
  return res.status(200).json({
    success: true,
    player: req.player,
  });
});

module.exports = router;
