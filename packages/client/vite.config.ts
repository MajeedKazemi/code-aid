import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
    resolve: {
        alias: [
            {
                find: "vscode",
                replacement: path.resolve(
                    __dirname,
                    "../../node_modules/monaco-languageclient/lib/vscode-compatibility"
                ),
            },
        ],
    },
    plugins: [react()],
});
