const { getScoreboard, getLobbyFromKey, getLobbyFromID } = require("../../utils");

function showScoreboard(socket, io) {
  socket.on("show-scoreboard", async (lobbyid, cb) => {
    if (!lobbyid) {
      return cb({ success: false, message: "Lobbyid is required" });
    }
    const lobby = await getLobbyFromID(lobbyid);
    if (!lobby) {
      return cb({ success: false, message: "Nincs ilyen lobby" });
    }
    const scoreboard = await getScoreboard(lobbyid);

    io.to(lobby.LobbyKey).emit("show-scoreboard", scoreboard);
    cb({ success: true, scoreboard, message: "Sikeresen megjelenítetted a pont táblázatot!" });
  });
}

module.exports = showScoreboard;
