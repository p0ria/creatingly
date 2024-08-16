import { Socket } from "socket.io";

export function leaveCurrentDoc(socket: Socket) {
  return Promise.all(
    [...socket.rooms]
      .filter((room) => room != socket.id)
      .map((room) => {
        socket.leave(room);
      })
  );
}
