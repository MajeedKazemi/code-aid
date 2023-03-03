import { io } from "socket.io-client";

export const connectSocket = (token: string) => {
    const socket = io("ws://localhost:3001", {
        autoConnect: true,
        query: { token },
    });

    socket.on("connect", () => {
        console.log(`Connected to Socket.IO server with ID ${socket.id}`);
    });

    socket.on("disconnect", (reason: string) => {
        console.log(`Disconnected from Socket.IO server: ${reason}`);
    });

    socket.on("error", (err: Error) => {
        console.error(`Socket.IO error: ${err.message}`);
    });

    return socket;
};

// TODO: might needthe following for [production] deployment

// function createUrl(hostname: string, port: number, path: string): string {
//     let host = hostname;

//     if (host.startsWith("http") || host.startsWith("https")) {
//         host = host.substring(host.indexOf("://") + 3);
//     }

//     if (host.includes(":")) {
//         host = host.substring(0, host.indexOf(":"));
//     }

//     const protocol = location.protocol === "https:" ? "wss" : "ws";

//     let url = `${host}${path}`;

//     if (import.meta.env.DEV) {
//         url = `${host}:${port}${path}`;
//     }

//     return normalizeUrl(`${protocol}://${url}`);
// }
