const { createLobby, GLOBALROOM } = require("../../utils");

function handleCreateLobby(socket) {
  socket.on("create-lobby", async (playerID, lobbyname, cb) => {
    if (!lobbyname) {
      return cb({ success: false, message: "Lobby name is required" });
    }
    if (socket.lobby) {
      return cb({ success: false, message: "You are already in a lobby" });
    }
    if (!playerID) {
      return cb({ success: false, message: "Player ID is required" });
    }
    const lobby = await createLobby(playerID, lobbyname);
    if (!lobby) {
      return cb({ success: false, message: "Error creating lobby" });
    }
    socket.lobby = lobby;
    socket.join(lobby.LobbyKey);
    socket.to(GLOBALROOM).emit("lobby-created", lobby);

    cb({ success: true, lobby, message: "Lobby created" });
  });
}

module.exports = handleCreateLobby;
