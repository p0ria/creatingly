import { Server } from "socket.io";
import { createServer } from "http";
import { WsEvent } from "./types";
const doc1 = "doc1";
const httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
        origin: true,
    },
});
io.on("connection", (socket) => {
    console.log(`Socket ${socket.id} connected`);
    socket.join(doc1);
    socket.on(WsEvent.ElChanged, (el) => {
        console.log("ElChanged received", el);
    });
});
io.on("disconnection", (socket) => {
    console.log(`Socket ${socket.id} disconnected`);
});
httpServer.listen(3000, () => {
    console.log("Server is listening on port 3000...");
});
//# sourceMappingURL=index.js.map