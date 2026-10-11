import { io, type Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL ?? "http://localhost:4000";
export function createKawiraSocket(token: string): Socket {
  return io(SOCKET_URL, {
    auth: { token },
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: 8
  });
}

// Install in frontend: npm install socket.io-client
// Example:
// const socket = createKawiraSocket(token);
// socket.emit("conversation:join", { conversationId });
// socket.emit("message:send", { conversationId, text });
// socket.on("message:new", message => setMessages(prev => [...prev, message]));
