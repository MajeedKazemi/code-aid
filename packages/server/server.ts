import "./utils/strategy";

import bodyParser from "body-parser";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import Session from "express-session";
import mongoose from "mongoose";
import passport from "passport";

import { testDiffs } from "./codex-prompts/shared/agents";
import { adminRouter } from "./routes/admin-router";
import { codexRouter } from "./routes/codex-router";
import { loginRouter } from "./routes/login-router";
import { responseRouter } from "./routes/response-router";
import { initializeSocket } from "./sockets/socket-handler";
import env from "./utils/env";

const corsOptions = {
    origin: (origin: any, callback: any) => {
        const whitelist = env.WHITELISTED_DOMAINS.split(",").map((d) =>
            d.trim()
        );

        if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
};

mongoose
    .connect(env.MONGODB_URI)
    .then((db) => {
        const app = express();

        app.use(cors(corsOptions));
        app.use(
            Session({
                secret: env.COOKIE_SECRET,
                resave: false,
                saveUninitialized: false,
            })
        );

        app.use(compression());
        app.use(cookieParser(env.COOKIE_SECRET));
        app.use(passport.initialize());
        app.use(passport.session());
        app.use(
            bodyParser.json({
                limit: "50mb",
            })
        );
        app.use(
            bodyParser.urlencoded({
                limit: "10mb",
            })
        );

        app.use("/api/auth/", loginRouter);
        app.use("/api/codex/", codexRouter);
        app.use("/api/responses/", responseRouter);
        app.use("/api/admin/", adminRouter);

        const server = app.listen(
            env.PORT_PREFIX + env.NODE_APP_INSTANCE,
            () => {
                console.log(
                    `Express server listening at http://localhost:${
                        env.PORT_PREFIX + env.NODE_APP_INSTANCE
                    }`
                );
            }
        );

        initializeSocket(server);
    })
    .catch((err) => {
        console.error("[Terminating] Error connecting to MongoDB: ", err);
    });

testDiffs();
