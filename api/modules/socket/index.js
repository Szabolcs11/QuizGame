const socketIO = require("socket.io");
const joinLobbyHandler = require("./socketHandlers/joinLobby");
const handleCreateLobby = require("./socketHandlers/createLobby");
const { handlePlayerDisconnect, getLobbyFromKey } = require("../utils");

const GLOBALROOM = "GLOBALROOM";

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
        io.to(GLOBALROOM).emit("update-lobby-players-counter", lobby);
      }
    });

    joinLobbyHandler(socket, io);
    handleCreateLobby(socket);
  });

  return io;
}

module.exports = initializeSocket;
