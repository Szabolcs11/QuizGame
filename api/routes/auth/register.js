const express = require("express");
const router = express.Router();
const responses = require("../../modules/responses/responses.json");
const { returnError, getUserByToken, createPlayer } = require("../../modules/utils/index.js");

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.post("/", async (req, res) => {
  const { Name } = req.body;
  if (!req.cookies.quizgame_sessiontoken) {
    if (!Name) return await returnError(req, res, responses.Missing_Name);
    if (Name.length < 3 || Name.length > 16) return await returnError(req, res, responses.Invalid_Name_Length);

    let { player, token } = await createPlayer(Name);
    if (!player) return await returnError(req, res, responses.Player_Creation_Failed);

    return res
      .cookie("quizgame_sessiontoken", token, {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
        sameSite: "strict",
        secure: true,
      })
      .status(200)
      .json({
        success: true,
        message: "Sikeres regisztráció!",
        player,
      });
  } else {
    return await returnError(req, res, responses.Already_Logged_In);
  }
});

module.exports = router;
