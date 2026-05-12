const { Server } = require("socket.io");

let io;

const setSocket = (server) => {
  io = new Server(server, {
    cors: { origin: "*" },
  });

  console.log("✅ Socket initialized");

  return io;
};

const getIO = () => {
  if (!io) throw new Error("Socket not initialized");
  return io;
};

module.exports = { setSocket, getIO };