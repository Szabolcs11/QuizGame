function handleCreateLobby(socket) {
  socket.on("create-lobby", (data, cb) => {
    console.log("create lobby", data);
    cb({ success: true });
  });
}

module.exports = handleCreateLobby;
