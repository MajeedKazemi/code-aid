import React from "react";

import { IContext } from "./types";

interface IAuthContext {
    context: IContext | null;
    setContext: (context: IContext | null) => void;
}

export const AuthContext = React.createContext<IAuthContext>({
    context: null,
    setContext: (context: IContext | null) => {},
});
