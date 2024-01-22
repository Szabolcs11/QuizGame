const {
  getLobbyQuestions,
  getCurrentQuestion,
  getLobbyFromID,
  updateQuestionStatus,
  calculatePoints,
} = require("../../utils");

function endQuestion(socket, io) {
  socket.on("end-question", async (PlayerID, LobbyID, cb) => {
    if (!PlayerID) {
      return cb({ success: false, message: "Player ID is required" });
    }
    if (!LobbyID) {
      return cb({ success: false, message: "Lobby ID is required" });
    }

    let lobby = await getLobbyFromID(LobbyID);
    if (!lobby) return cb({ success: false, message: "Lobby not found" });

    let CurrentQuestion = await getCurrentQuestion(lobby.ID);
    if (!CurrentQuestion) return cb({ success: false, message: "Error getting current question" });

    const questions = await getLobbyQuestions(lobby.ID);
    if (!questions) return cb({ success: false, message: "Error getting questions" });

    const updatedQuestionStatus = await updateQuestionStatus(CurrentQuestion.ID, "answered");
    if (!updatedQuestionStatus) return cb({ success: false, message: "Error updating question status" });

    const { AnswersWithScores, correctAnswer } = await calculatePoints(CurrentQuestion.ID, lobby.ID);
    if (!AnswersWithScores) return cb({ success: false, message: "Error calculating points" });

    let PlayerAnswers = [];
    let PlayersScored = [];
    AnswersWithScores.map((answer) => {
      PlayerAnswers.push({
        PlayerID: answer.PlayerID,
        PlayerName: answer.PlayerName,
        AnswerID: answer.AnswerID,
        AnswerText: answer.AnswerText,
      });
      PlayersScored.push({
        PlayerID: answer.PlayerID,
        PlayerName: answer.PlayerName,
        Score: answer.Score,
      });
    });

    io.to(lobby.LobbyKey).emit("question-ended", PlayerAnswers, correctAnswer);
    cb({ success: true, PlayersScored });
  });
}

module.exports = endQuestion;
