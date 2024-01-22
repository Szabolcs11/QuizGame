const { getLobbyFromKey, getLobbyQuestions, joinLobby, GLOBALROOM } = require("../../utils");

function joinEditLobby(socket, io) {
  socket.on("join-edit-lobby", async (player, lobbykey, cb) => {
    if (!lobbykey) {
      return cb({ success: false, message: "Lobbykey is required" });
    }
    if (!player.ID) {
      return cb({ success: false, message: "Player ID is required" });
    }
    const lobby = await getLobbyFromKey(lobbykey);
    if (!lobby) {
      return cb({ success: false, message: "Error getting lobby" });
    }
    const isAdmin = lobby.LobbyOwnerID === player.ID;
    if (!isAdmin) {
      return cb({ success: false, message: "You are not an admin" });
    }
    let joined = joinLobby(lobby.ID, player.ID);
    if (!joined) {
      return cb({ success: false, message: "Error joining lobby" });
    }
    player.IsAdmin = 1;
    lobby.Players.push(player);
    socket.lobby = lobby;
    socket.player = player;
    socket.join(lobby.LobbyKey);
    io.to(GLOBALROOM).emit("update-lobby", lobby);
    io.to(lobby.LobbyKey).emit("player-joined", player, lobby);
    const questions = await getLobbyQuestions(lobby.ID);

    cb({ success: true, lobby, questions });
  });
}

module.exports = joinEditLobby;
