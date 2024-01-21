const socketIO = require("socket.io");
const joinLobbyHandler = require("./socketHandlers/joinLobby");
const handleCreateLobby = require("./socketHandlers/createLobby");
const { handlePlayerDisconnect, getLobbyFromKey, GLOBALROOM } = require("../utils");
const leaveLobbyHandler = require("./socketHandlers/leaveLobby");
const joinEditLobby = require("./socketHandlers/joinEditLobby");
const addQuestionHandler = require("./socketHandlers/addQuestion");
const updateQuestionOrder = require("./socketHandlers/updateQuestionOrder");
const handleDeleteQuestion = require("./socketHandlers/handleDeleteQuestion");
const startLobby = require("./socketHandlers/startLobby");
const handlejoinOnGoingGame = require("./socketHandlers/handleJoinOnGoingGame");
const handleAdminJoin = require("./socketHandlers/handleAdminJoin");
const handleAnswerQuestion = require("./socketHandlers/handleAnswerQuestion");
const nextQuestion = require("./socketHandlers/nextQuestion");
const endQuestion = require("./socketHandlers/endQuestion");
const showScoreboard = require("./socketHandlers/showScoreboard");

function initializeSocket(server) {
  const io = socketIO(server, { cors: { origin: "*" } });

  io.on("connection", (socket) => {
    socket.join(GLOBALROOM);
    socket.on("disconnect", async () => {
      if (!socket?.player) return;
      let result = await handlePlayerDisconnect(socket?.player?.ID);
      const LobbyKey = socket?.lobby?.LobbyKey;
      if (LobbyKey) {
        const lobby = await getLobbyFromKey(LobbyKey);
        if (!lobby) return;
        io.to(LobbyKey).emit("player-left", result, lobby);
        io.to(GLOBALROOM).emit("update-lobby", lobby);
        socket.lobby = null;
        socket.leave(LobbyKey);
      }
    });

    leaveLobbyHandler(socket, io);
    joinLobbyHandler(socket, io);
    handleCreateLobby(socket, io);
    joinEditLobby(socket);
    addQuestionHandler(socket);
    updateQuestionOrder(socket);
    handleDeleteQuestion(socket);
    startLobby(socket, io);
    handlejoinOnGoingGame(socket, io);
    handleAdminJoin(socket, io);
    handleAnswerQuestion(socket, io);
    nextQuestion(socket, io);
    endQuestion(socket, io);
    showScoreboard(socket, io);
  });

  return io;
}

module.exports = initializeSocket;
