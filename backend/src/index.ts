import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { designer } from "./designer";
import {
  DocName,
  DocStateData,
  ElChangedData,
  NewDocData,
  NewElData,
  SwitchDocData,
  WsEvent,
} from "./types";
import { leaveCurrentDoc } from "./utils";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: true,
  },
});

io.on("connection", (socket) => {
  console.log(`Socket ${socket.id} connected`);

  socket.emit(WsEvent.DocsList, designer.docs);

  socket.on(WsEvent.NewDoc, async (newDoc: NewDocData) => {
    designer.addDoc(newDoc);
    io.emit(WsEvent.DocsList, designer.docs);
    await switchDoc(socket, newDoc);
  });

  socket.on(WsEvent.SwitchDoc, async (data: SwitchDocData) => {
    await switchDoc(socket, data);
  });

  socket.on(WsEvent.ElChanged, (data: ElChangedData) => {
    socket.to(data.doc).emit(WsEvent.ElChanged, data);
    designer.updateEl(data.doc, data.el);
  });

  socket.on(WsEvent.NewEl, (data: NewElData) => {
    socket.to(data.doc).emit(WsEvent.NewEl, data);
    designer.updateEl(data.doc, data.el);
  });
});

const switchDoc = async (socket: Socket, doc: DocName) => {
  await leaveCurrentDoc(socket);
  await socket.join(doc);
  socket.emit(WsEvent.DocState, {
    doc,
    state: designer.state[doc] || {},
  } as DocStateData);
};

httpServer.listen(3000, () => {
  console.log("Server is listening on port 3000...");
});
