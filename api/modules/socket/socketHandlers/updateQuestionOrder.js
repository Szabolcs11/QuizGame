const { handleupdateQuestionOrder } = require("../../utils");

function updateQuestionOrder(socket) {
  socket.on("update-questions-order", async (lobbyid, question, cb) => {
    if (!lobbyid) {
      return cb({ success: false, message: "Lobbyid is required" });
    }
    if (!question) {
      return cb({ success: false, message: "Question is required" });
    }

    await Promise.all(
      question.map(async (e) => {
        let res = await handleupdateQuestionOrder(e, lobbyid);
        if (!res) {
          return cb({ success: false, message: "Nem sikerült módosítani a kérdés sorrendet" });
        }
      })
    );

    cb({ success: true, message: "Sikeresen módosítottad a kérdés sorrendet" });
  });
}

module.exports = updateQuestionOrder;
