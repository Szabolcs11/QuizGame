const { getLobbyFromKey, joinLobby, GLOBALROOM } = require("../../utils");
const responses = require("../../responses/responses.json");

function handleJoinLobby(socket, io) {
  socket.on("join-lobby", async (LobbyKey, PlayerID, cb) => {
    const lobby = await getLobbyFromKey(LobbyKey);
    if (!lobby) return cb({ success: false, message: responses.lobbyNotFound });
    if (lobby.LobbyOwnerID == PlayerID) {
      return cb({ success: true, lobby, isAdmin: true });
    }
    let player = await joinLobby(lobby.ID, PlayerID);
    if (player == "LOBBY_PLAYING") return cb({ success: false, message: responses.lobbyPlaying });
    if (!player) return cb({ success: false, message: responses.playerNotFound });
    lobby.Players.push(player);

    socket.player = player;
    socket.lobby = lobby;

    io.to(LobbyKey).emit("player-joined", player, lobby);

    io.to(GLOBALROOM).emit("update-lobby", lobby);

    socket.join(LobbyKey);
    cb({ success: true, lobby, isAdmin: Boolean(player.IsAdmin) });
  });
}

module.exports = handleJoinLobby;
