import React from "react";
import { Socket } from "socket.io-client";

import { IContext } from "./types";

interface IAuthContext {
    context: IContext | null;
    setContext: (context: IContext | null) => void;
}

export const AuthContext = React.createContext<IAuthContext>({
    context: null,
    setContext: (context: IContext | null) => {},
});

interface ISocketContext {
    socket: Socket | null;
    setSocket: (socket: Socket | null) => void;
}

export const SocketContext = React.createContext<ISocketContext>({
    socket: null,
    setSocket: (socket: Socket | null) => {},
});
