const { getLobbyFromKey, getLobbyQuestions, addQuestion } = require("../../utils");

function addQuestionHandler(socket) {
  socket.on("add-question", async (lobbyid, question, cb) => {
    if (!lobbyid) {
      return cb({ success: false, message: "Lobbyid is required" });
    }
    if (!question) {
      return cb({ success: false, message: "Question is required" });
    }

    const newQuestion = await addQuestion(question, lobbyid);

    cb({ success: true, newQuestion, message: "Sikeresen hozzáadtad a kérdést" });
  });
}

module.exports = addQuestionHandler;
