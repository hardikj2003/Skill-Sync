// In client/context/SocketContext.tsx

"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";
import { useSession } from "next-auth/react";

interface SocketContextType {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType>({ socket: null });

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const { data: session } = useSession();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (session?.user) {
      const newSocket = io("http://localhost:5001"); // Your backend server URL
      setSocket(newSocket);

      // Send the user ID to the server to track online users
      newSocket.emit("addUser", session.user.id);

      return () => {
        newSocket.close();
      };
    } else {
      // If there's no session, disconnect any existing socket
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [session]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
