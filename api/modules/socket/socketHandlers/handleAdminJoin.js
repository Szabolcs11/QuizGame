const { joinOnGoingGame, getLobbyFromKey, GLOBALROOM, getLobbyQuestions, getCurrentQuestion } = require("../../utils");

function handleAdminJoin(socket, io) {
  socket.on("join-game-admin", async (PlayerID, LobbyKey, cb) => {
    if (!PlayerID) {
      return cb({ success: false, message: "Player ID is required" });
    }
    if (!LobbyKey) {
      return cb({ success: false, message: "Lobby Key is required" });
    }
    let lobby = await getLobbyFromKey(LobbyKey);
    if (lobby.Status == "waiting") return cb({ success: false, message: "Lobby is on waiting..." });
    if (!lobby) return cb({ success: false, message: "Lobby not found" });

    let newLobby = await joinOnGoingGame(lobby.ID, PlayerID, 1);
    if (!newLobby) return cb({ success: false, message: "Error joining game" });

    let CurrentQuestion = await getCurrentQuestion(newLobby.ID);
    if (!CurrentQuestion) return cb({ success: false, message: "Error getting current question" });

    newLobby.CurrentQuestion = CurrentQuestion;

    const questions = await getLobbyQuestions(newLobby.ID);
    if (!questions) return cb({ success: false, message: "Error getting questions" });

    socket.player = newLobby.Players.find((e) => e.ID == PlayerID);
    socket.lobby = newLobby;
    socket.join(LobbyKey);
    io.to(GLOBALROOM).emit("update-lobby", newLobby);
    io.to(LobbyKey).emit("player-joined", socket.player, newLobby);
    cb({ success: true, lobby: newLobby, questions });
  });
}

module.exports = handleAdminJoin;
