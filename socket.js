const { Server } = require("socket.io");

let io;
global.onlineUsers = {};

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("client connected:", socket.id);

    socket.on("register", ({ userId, role }) => {
      if (!userId) return;
      global.onlineUsers[userId] = socket.id;
      if (role === "super_admin" || role === "admin") {
        socket.join("super_admin");
      }
      socket.join(`user_${userId}`);
    });

    socket.on("disconnect", () => {
      for (const userId in onlineUsers) {
        if (onlineUsers[userId] === socket.id) {
          delete onlineUsers[userId];
          break;
        }
      }
      console.log("client disconnected:", socket.id);
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
