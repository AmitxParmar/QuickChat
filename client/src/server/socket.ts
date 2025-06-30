import { Server as SocketIOServer } from "socket.io";

export const onlineUsers = new Map<string, string>();

const socketHandler = (io: SocketIOServer) => {
  io.on("connection", (socket) => {
    console.log("socket connected");
    const userId = socket.handshake.query.userId as string;
    onlineUsers.set(userId, socket.id);

    io.emit("get-online-users", {
      onlineUsers: Array.from(onlineUsers.keys()),
    });

    socket.on("add-user", (userId) => {
      onlineUsers.set(userId, socket.id);
      socket.broadcast.emit("online-users", {
        onlineUsers: Array.from(onlineUsers.keys()),
      });
    });

    socket.on("send-msg", (data) => {
      const sendUserSocket = onlineUsers.get(data.to);
      if (sendUserSocket) {
        io.to(sendUserSocket).emit("msg-receive", data);
      }
    });

    socket.on("message-seen", (data) => {
      const sendUserSocket = onlineUsers.get(data.from);
      if (sendUserSocket) {
        io.to(sendUserSocket).emit("msg-seen", data);
      }
    });

    socket.on("typing", (data) => {
      const sendUserSocket = onlineUsers.get(data.to);
      if (sendUserSocket) {
        io.to(sendUserSocket).emit("typing", data);
      }
    });

    socket.on("stop-typing", (data) => {
      const sendUserSocket = onlineUsers.get(data.from);
      if (sendUserSocket) {
        io.to(sendUserSocket).emit("stop-typing", data);
      }
    });

    socket.on("disconnect", () => {
      onlineUsers.delete(userId);
      io.emit("get-online-users", {
        onlineUsers: Array.from(onlineUsers.keys()),
      });
    });
  });
};

export default socketHandler;
