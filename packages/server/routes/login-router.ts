import express from "express";
import jwt from "jsonwebtoken";
import passport from "passport";

import { getUserData, UserModel } from "../models/user";
import env from "../utils/env";
import {
    COOKIE_OPTIONS,
    getRefreshToken,
    getToken,
    verifyUser,
} from "../utils/strategy";

export const loginRouter = express.Router();

loginRouter.post("/signup", (req, res, next) => {
    // Verify that first name is not empty
    if (!req.body.firstName) {
        res.statusCode = 500;
        res.send({
            name: "FirstNameError",
            message: "The first name is required",
        });
    } else {
        UserModel.register(
            new UserModel({ username: req.body.username }),
            req.body.password,
            (err, user) => {
                if (err) {
                    res.statusCode = 500;
                    res.send(err);
                } else {
                    user.firstName = req.body.firstName;
                    user.lastName = req.body.lastName || "";

                    const token = getToken({ _id: user._id });
                    const refreshToken = getRefreshToken({ _id: user._id });

                    user.refreshToken.push({ refreshToken });

                    user.save((err: any, user: any) => {
                        if (err) {
                            res.statusCode = 500;
                            res.send(err);
                        } else {
                            res.cookie(
                                "refreshToken",
                                refreshToken,
                                COOKIE_OPTIONS
                            );
                            res.send({
                                success: true,
                                token,
                                user: getUserData(user),
                            });
                        }
                    });
                }
            }
        );
    }
});

loginRouter.post(
    "/login",
    passport.authenticate("local"),
    (req: any, res: any, next) => {
        const token = getToken({ _id: req.user._id });
        const refreshToken = getRefreshToken({ _id: req.user._id });
        UserModel.findById(req.user._id).then(
            (user: any) => {
                user.refreshToken.push({ refreshToken });
                user.save((err: any, user: any) => {
                    if (err) {
                        res.statusCode = 500;
                        res.send(err);
                    } else {
                        res.cookie(
                            "refreshToken",
                            refreshToken,
                            COOKIE_OPTIONS
                        );
                        res.send({
                            success: true,
                            token,
                            user: getUserData(user),
                        });
                    }
                });
            },
            (err) => next(err)
        );
    }
);

loginRouter.post("/refreshToken", (req: any, res: any, next) => {
    const { signedCookies = {} } = req;
    const { refreshToken } = signedCookies;

    if (refreshToken) {
        const payload = jwt.verify(
            refreshToken,
            env.REFRESH_TOKEN_SECRET
        ) as jwt.JwtPayload;
        const userId = payload._id;
        UserModel.findOne({ _id: userId }).then(
            (user: any) => {
                if (user) {
                    // Find the refresh token against the user record in database
                    const tokenIndex = user.refreshToken.findIndex(
                        (item: any) => item.refreshToken === refreshToken
                    );

                    if (tokenIndex === -1) {
                        res.statusCode = 401;
                        res.send("Unauthorized");
                    } else {
                        const token = getToken({ _id: userId });
                        // If the refresh token exists, then create new one and replace it.
                        const newRefreshToken = getRefreshToken({
                            _id: userId,
                        });
                        user.refreshToken[tokenIndex] = {
                            refreshToken: newRefreshToken,
                        };
                        user.save((err: any, user: any) => {
                            if (err) {
                                res.statusCode = 500;
                                res.send(err);
                            } else {
                                res.cookie(
                                    "refreshToken",
                                    newRefreshToken,
                                    COOKIE_OPTIONS
                                );
                                res.send({
                                    success: true,
                                    token,
                                    user: getUserData(user),
                                });
                            }
                        });
                    }
                } else {
                    res.statusCode = 401;
                    res.send("Unauthorized");
                }
            },
            (err) => next(err)
        );
    } else {
        res.statusCode = 401;
        res.send("Unauthorized");
    }
});

loginRouter.get("/logout", verifyUser, (req: any, res: any, next) => {
    const { signedCookies = {} } = req;
    const { refreshToken } = signedCookies;

    UserModel.findById(req.user._id).then(
        (user: any) => {
            const tokenIndex = user.refreshToken.findIndex(
                (item: any) => item.refreshToken === refreshToken
            );

            if (tokenIndex !== -1) {
                user.refreshToken
                    .id(user.refreshToken[tokenIndex]._id)
                    .remove();
            }

            user.save((err: any, user: any) => {
                if (err) {
                    res.statusCode = 500;
                    res.send(err);
                } else {
                    res.clearCookie("refreshToken", COOKIE_OPTIONS);
                    res.send({ success: true });
                }
            });
        },
        (err) => next(err)
    );
});

loginRouter.get("/me", verifyUser, (req: any, res, next) => {
    res.send({ user: req.user });
});
