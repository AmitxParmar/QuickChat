import { createContext, useContext, ReactNode } from "react";

type SocketContextType = WebSocket | null; // Adjust this type based on your actual socket implementation

const SocketContext = createContext<SocketContextType>(null);

interface SocketProviderProps {
  children: ReactNode;
  socket: SocketContextType;
}

export const SocketProvider = ({ children, socket }: SocketProviderProps) => {
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};
