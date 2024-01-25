const { getScoreboard, getLobbyFromKey, getLobbyFromID, changeLobbyStatus } = require("../../utils");

function finishGame(socket, io) {
  socket.on("finish-game", async (lobbyid, cb) => {
    if (!lobbyid) {
      return cb({ success: false, message: "Lobbyid is required" });
    }
    const lobby = await getLobbyFromID(lobbyid);
    if (!lobby) {
      return cb({ success: false, message: "Nincs ilyen lobby" });
    }
    const updatedLobbyStatus = await changeLobbyStatus(lobbyid, "finished");
    if (!updatedLobbyStatus) {
      return cb({ success: false, message: "Nem sikerült lezárni a játékot" });
    }

    const scoreboard = await getScoreboard(lobbyid);
    if (!scoreboard) {
      return cb({ success: false, message: "Nem sikerült lekérni a pontokat" });
    }

    io.to(lobby.LobbyKey).emit("finish-game", scoreboard);
    cb({ success: true, scoreboard, message: "Podium" });
  });
}

module.exports = finishGame;
