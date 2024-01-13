const { getUserByToken, returnError } = require("../utils");
const responses = require("../responses/responses.json");

const Authenticate = async (req, res, next) => {
  if (req.cookies.quizgame_sessiontoken) {
    const player = await getUserByToken(req.cookies.quizgame_sessiontoken);
    if (!player) return await returnError(req, res, responses.Not_Logged_In);
    req.player = player;
    next();
  } else {
    return await returnError(req, res, responses.Not_Logged_In);
  }
};

module.exports = { Authenticate };
