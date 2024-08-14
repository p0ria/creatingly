import { Server } from "socket.io";
import { createServer } from "http";
import { designer } from "./designer";
import { WsEvent, UiElement } from "./types";

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

  socket.emit(WsEvent.CurrentState, designer.state);

  socket.on(WsEvent.ElChanged, (el: UiElement) => {
    socket.to(doc1).emit(WsEvent.ElChanged, el);
    designer.update(el);
  });

  socket.on(WsEvent.NewEl, (el: UiElement) => {
    socket.to(doc1).emit(WsEvent.NewEl, el);
    designer.update(el);
  });
});

httpServer.listen(3000, () => {
  console.log("Server is listening on port 3000...");
});
