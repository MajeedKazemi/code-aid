import "./index.css";
import "./userWorker";

import * as monaco from "monaco-editor";
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";

import { authRefresh } from "./api/api";
import { Loader } from "./components/loader";
import { AuthContext } from "./context";
import { AnalyzePage } from "./routes/analyze-page";
import { HomePage } from "./routes/home-page";
import { LoginPage } from "./routes/login-page";
import { SummaryPage } from "./routes/summary-page";

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("[index.html] missing root element");
const root = ReactDOM.createRoot(rootEl);

function RequireAuth({
    children,
    role,
}: {
    children: JSX.Element;
    role: "any" | "user" | "admin";
}) {
    const [loading, setLoading] = useState(true);
    let { context, setContext } = useContext(AuthContext);
    let location = useLocation();

    const verifyUser = useCallback(() => {
        setLoading(true);

        authRefresh()
            .then(async (response) => {
                if (response.ok) {
                    const data = await response.json();

                    setContext({ token: data.token, user: data.user });
                } else {
                    // logError(response.toString());
                }

                setLoading(false);
            })
            .catch((error) => {
                // logError(error.toString());
                setLoading(false);
            });

        setTimeout(verifyUser, 60 * 5 * 1000);
    }, [setContext]);

    useEffect(() => {
        verifyUser();
    }, [verifyUser]);

    if (loading && !context?.token) return <Loader />;
    else if (!context?.token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    } else return children;
}

const initializeMonacoTheme = () => {
    monaco.editor.defineTheme("dark", {
        base: "vs-dark",
        inherit: true,
        rules: [{ background: "001e3c", token: "" }],
        colors: {
            "editor.background": "#001e3c",
        },
    });
    monaco.editor.setTheme("myTheme");
};

function App() {
    const [context, setContext] = useState(null);
    const value = useMemo(
        () => ({ context: context, setContext: setContext }),
        [context]
    ) as any;

    initializeMonacoTheme();

    return (
        <AuthContext.Provider value={value}>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route
                        path="/"
                        element={
                            <RequireAuth role="any">
                                <HomePage />
                            </RequireAuth>
                        }
                    />
                    <Route
                        path="/analyze"
                        element={
                            <RequireAuth role="admin">
                                <AnalyzePage />
                            </RequireAuth>
                        }
                    />
                    <Route
                        path="/summary"
                        element={
                            <RequireAuth role="admin">
                                <SummaryPage />
                            </RequireAuth>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </AuthContext.Provider>
    );
}

root.render(<App />);
