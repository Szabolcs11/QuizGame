const { getLobbyFromID, resetLobby, GLOBALROOM } = require("../../utils");

function resetGame(socket, io) {
  socket.on("reset-game", async (LobbyID, cb) => {
    if (!LobbyID) {
      return cb({ success: false, message: "Lobby ID is required" });
    }
    let lobby = await getLobbyFromID(LobbyID);
    if (!lobby) return cb({ success: false, message: "Lobby not found" });

    let reseted = await resetLobby(lobby.ID);
    if (!reseted) return cb({ success: false, message: "Error resetting game" });

    io.to(lobby.LobbyKey).emit("game-reseted", lobby);
    io.to(GLOBALROOM).emit("update-lobby", lobby);
    cb({ success: true, message: "Game reseted" });
  });
}

module.exports = resetGame;
