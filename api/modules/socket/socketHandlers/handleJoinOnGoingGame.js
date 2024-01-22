const { joinOnGoingGame, getLobbyFromKey, GLOBALROOM, getCurrentQuestion } = require("../../utils");

function handlejoinOnGoingGame(socket, io) {
  socket.on("join-game", async (PlayerID, LobbyKey, cb) => {
    if (!PlayerID) {
      return cb({ success: false, message: "Player ID is required" });
    }
    if (!LobbyKey) {
      return cb({ success: false, message: "Lobby Key is required" });
    }
    let lobby = await getLobbyFromKey(LobbyKey);
    if (lobby.Status == "waiting") return cb({ success: false, message: "Lobby is on waiting..." });
    if (!lobby) return cb({ success: false, message: "Lobby not found" });

    let newLobby = await joinOnGoingGame(lobby.ID, PlayerID, 0);
    if (!newLobby) return cb({ success: false, message: "Error joining game" });

    const CurrentQuestion = await getCurrentQuestion(newLobby.ID);
    if (!CurrentQuestion) return cb({ success: false, message: "Error getting current question" });

    // Delete IsCorrect property from answers
    delete newLobby.CurrentQuestionID;
    CurrentQuestion.Answers.map((e) => {
      delete e.IsCorrect;
    });
    newLobby.CurrentQuestion = CurrentQuestion;

    console.log(newLobby);
    socket.player = newLobby.Players.find((e) => e.ID == PlayerID);
    socket.lobby = newLobby;

    socket.join(LobbyKey);
    io.to(GLOBALROOM).emit("update-lobby", newLobby);
    io.to(LobbyKey).emit("player-joined", socket.player, newLobby);
    cb({ success: true, lobby: newLobby });
  });
}

module.exports = handlejoinOnGoingGame;
