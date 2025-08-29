let io;

function initSocket(server) {
  const socketIo = require("socket.io");
  io = socketIo(server, {
    cors: { origin: "*" }
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("register", (userId) => {
      socket.join(userId.toString());
      console.log(`User ${userId} joined their room`);
    });
  });
}

function getIO() {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
}

module.exports = { initSocket, getIO };
