const { deleteQuestion } = require("../../utils");

function handleDeleteQuestion(socket) {
  socket.on("delete-question", async (lobbyID, QuestionID, cb) => {
    if (!lobbyID) {
      return cb({ success: false, message: "Lobby ID is required" });
    }
    if (!QuestionID) {
      return cb({ success: false, message: "Question ID is required" });
    }
    const deleted = await deleteQuestion(QuestionID);
    if (!deleted) {
      return cb({ success: false, message: "Error deleting question" });
    }
    cb({ success: true });
  });
}

module.exports = handleDeleteQuestion;
