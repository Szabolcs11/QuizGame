const express = require("express");
const { Authenticate } = require("../../modules/authenticate/authenticate.js");
const router = express.Router();

router.use(Authenticate);

router.use("/lobbies", require("./getLobbies.js"));

module.exports = router;
