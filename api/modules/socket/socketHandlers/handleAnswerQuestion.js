const { answerQuestion, getLobbyFromID, isPlayerAnswered, getQuestionIsAnswered } = require("../../utils");

function handleAnswerQuestion(socket) {
  socket.on("answer-question", async (lobbyID, PlayerID, QuestionID, AnswerID, cb) => {
    if (!lobbyID) {
      return cb({ success: false, message: "Lobby ID is required" });
    }
    if (!QuestionID) {
      return cb({ success: false, message: "Question ID is required" });
    }
    if (!AnswerID) {
      return cb({ success: false, message: "Answer ID is required" });
    }
    if (!PlayerID) {
      return cb({ success: false, message: "Player ID is required" });
    }

    const isQuestionAnswered = await getQuestionIsAnswered(QuestionID);
    if (isQuestionAnswered) {
      return cb({ success: false, message: "A kérdés már nem megválaszolható!" });
    }

    const IsAnswered = await isPlayerAnswered(PlayerID, QuestionID);
    if (IsAnswered) {
      return cb({ success: false, message: "Már válaszolt a kérdésre!" });
    }

    const lobby = await getLobbyFromID(lobbyID);

    const answered = await answerQuestion(PlayerID, QuestionID, AnswerID);
    if (!answered) {
      return cb({ success: false, message: "Error answering question" });
    }

    socket.to(lobby.LobbyKey).emit("answered-question", PlayerID, QuestionID, AnswerID);

    cb({ success: true, message: "Answered question" });
  });
}

module.exports = handleAnswerQuestion;
