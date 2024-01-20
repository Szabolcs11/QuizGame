const { getLobbyFromKey, joinLobby, handlePlayerDisconnect, GLOBALROOM } = require("../../utils");
const responses = require("./../../responses/responses.json");

function leaveLobbyHandler(socket, io) {
  socket.on("player-left", async (LobbyKey, PlayerID, cb) => {
    if (!socket?.player) return;

    let result = await handlePlayerDisconnect(PlayerID);
    const lobby = await getLobbyFromKey(LobbyKey);
    if (!lobby) return;

    io.to(LobbyKey).emit("player-left", result, lobby);
    io.to(GLOBALROOM).emit("update-lobby", lobby);
    socket.leave(LobbyKey);
    socket.lobby = null;
    cb({ success: true, lobby });
  });
}

module.exports = leaveLobbyHandler;
