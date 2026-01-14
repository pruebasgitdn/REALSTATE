import { Server } from "socket.io";
import { config } from "dotenv";

config({ path: "./config.env" });
let io;
const userSocketMap = {};

export function initSocket(server) {
  const isDev = process.env.NODE_ENV !== "production";
  const clientOrigin = isDev
    ? process.env.FRONTEND_URI_DEV
    : process.env.FRONTEND_URI;

  io = new Server(server, {
    cors: {
      origin: clientOrigin,
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    },
    transports: ["websocket", "polling"],
    pingTimeout: 60000, // 60 s
    pingInterval: 25000, // 25 s
  });

  io.on("connection", (socket) => {
    console.log("Usuario conectado:", socket.id);

    const user_id = socket.handshake.query.user_id;
    if (user_id) userSocketMap[user_id] = socket.id;

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
      console.log("Usuario se desconecto:", socket.id);
      if (user_id) delete userSocketMap[user_id];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
  });
}

export function getReceiverSocketId(user_id) {
  return userSocketMap[user_id];
}

export { io };
