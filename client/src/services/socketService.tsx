import { HOST } from "@/utils/ApiRoutes";
import { ReactNode, createContext, useContext } from "react";
import { Socket, io } from "socket.io-client";

const socket: Socket = io(HOST),
  SocketContext = createContext<Socket>(socket);
socket.on("connect", () => console.log("socket connected!!"));

const SocketProvider = ({ children }: { children: ReactNode }) => {
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = (): Socket => useContext(SocketContext);

export default SocketProvider;
