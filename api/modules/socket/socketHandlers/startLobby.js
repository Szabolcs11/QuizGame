const {
  getLobbyFromKey,
  changeLobbyStatus,
  GLOBALROOM,
  changeCurrentQuestionID,
  getFirstQuessionID,
} = require("../../utils");
const responses = require("./../../responses/responses.json");

function startLobby(socket, io) {
  socket.on("start-lobby", async (LobbyKey, cb) => {
    const lobby = await getLobbyFromKey(LobbyKey);
    if (!lobby) return cb({ success: false, message: responses.lobbyNotFound });
    if (lobby.Players.length < 2) return cb({ success: false, message: responses.NotEnoughPlayers });
    const updatedLobby = await changeLobbyStatus(lobby.ID, "playing");
    if (!updatedLobby) return cb({ success: false, message: responses.lobbyNotFound });

    const QuestionID = await getFirstQuessionID(updatedLobby.ID);
    if (!QuestionID) return cb({ success: false, message: responses.NoQuestions });
    const updated = await changeCurrentQuestionID(updatedLobby.ID, QuestionID);
    if (!updated) return cb({ success: false, message: responses.lobbyNotFound });

    io.to(GLOBALROOM).emit("update-lobby", updatedLobby);
    io.to(lobby.LobbyKey).emit("lobby-started", updatedLobby);
    cb({ success: true, lobby: updatedLobby, message: responses.SuccessfullLobbyStart });
  });
}

module.exports = startLobby;
