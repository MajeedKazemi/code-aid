import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import ViteRadar from "vite-plugin-radar";

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
    plugins: [
        react(),
        ViteRadar({
            analytics: {
                id: "G-QFEEEEVZ6D",
                config: {
                    send_page_view: true,
                },
            },
        }),
    ],
});
