const express = require("express");
const router = express.Router();
const responses = require("../../modules/responses/responses.json");
const { getLobbies } = require("../../modules/utils");

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.get("/", async (req, res) => {
  const lobbies = await getLobbies();
  return res.status(200).json({
    success: true,
    lobbies: lobbies,
  });
});

module.exports = router;
