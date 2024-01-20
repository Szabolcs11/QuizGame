const { getLobbyFromID, handleNextQuestion } = require("../../utils");

function nextQuestion(socket, io) {
  socket.on("next-question", async (PlayerID, LobbyID, cb) => {
    if (!LobbyID) {
      return cb({ success: false, message: "Question ID is required" });
    }
    if (!PlayerID) {
      return cb({ success: false, message: "Player ID is required" });
    }

    const lobby = await getLobbyFromID(LobbyID);
    if (!lobby) {
      return cb({ success: false, message: "Lobby not found" });
    }

    let nextQuestion = await handleNextQuestion(lobby.ID);
    if (!nextQuestion) {
      return cb({ success: false, message: "No more questions" });
    }
    let temp = JSON.parse(JSON.stringify(nextQuestion));
    temp.Answers.map((e) => {
      delete e.IsCorrect;
    });

    io.to(lobby.LobbyKey).emit("change-question", temp);

    cb({ success: true, message: "Next question", currentQuestion: nextQuestion });
  });
}

module.exports = nextQuestion;
