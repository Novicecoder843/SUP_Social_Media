let io;

const setSocket = (server) => {
  const { Server } = require("socket.io");

  io = new Server(server, {
    cors: { origin: "*" }
  });

  require("../socket/chat.socket")(io);

  return io;
};

module.exports = { setSocket };