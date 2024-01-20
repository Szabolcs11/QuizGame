const { getLobbyFromKey, getLobbyQuestions } = require("../../utils");

function joinEditLobby(socket) {
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
    const isAdmin = lobby.Players.some((e) => {
      if (player.ID == e.ID && e.IsAdmin) return true;
      return false;
    });
    if (!isAdmin) {
      return cb({ success: false, message: "You are not an admin" });
    }
    socket.lobby = lobby;
    socket.player = player;
    socket.join(lobby.LobbyKey);

    const questions = await getLobbyQuestions(lobby.ID);

    cb({ success: true, lobby, questions });
  });
}

module.exports = joinEditLobby;
