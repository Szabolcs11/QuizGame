const { getScoreboard, getLobbyFromKey, getLobbyFromID } = require("../../utils");

function showScoreboard(socket, io) {
  socket.on("show-scoreboard", async (lobbyid, pointsScored, cb) => {
    if (!lobbyid) {
      return cb({ success: false, message: "Lobbyid is required" });
    }
    const lobby = await getLobbyFromID(lobbyid);
    if (!lobby) {
      return cb({ success: false, message: "Nincs ilyen lobby" });
    }
    const scoreboard = await getScoreboard(lobbyid);
    if (!scoreboard) {
      return cb({ success: false, message: "Nem sikerült lekérni a pontokat" });
    }
    const updatedScoreboard = scoreboard.map((e) => ({
      ...e,
      PointsAdded: pointsScored.find((p) => p.PlayerID === e.ID)?.Score || 0,
    }));

    io.to(lobby.LobbyKey).emit("show-scoreboard", updatedScoreboard);
    cb({ success: true, scoreboard, message: "Sikeresen megjelenítetted a pont táblázatot!" });
  });
}

module.exports = showScoreboard;
