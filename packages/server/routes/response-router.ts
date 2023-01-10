import express from "express";

import { IUser, UserModel } from "../models/user";
import { verifyUser } from "../utils/strategy";

export const responseRouter = express.Router();

responseRouter.get("/latest", verifyUser, async (req, res, next) => {
    const userId = (req.user as IUser)._id;

    UserModel.findById(userId)
        .populate({
            path: "responses",
            options: {
                sort: { time: -1 },
                limit: 3,
            },
        })
        .exec((err, user) => {
            if (err) {
                return next(err);
            }

            res.json({
                responses: user?.responses
                    .sort((a, b) => {
                        return a.time < b.time ? 1 : -1;
                    })
                    .map((response) => {
                        return {
                            time: response.time,
                            type: response.type,
                            data: response.data,
                            id: response._id,
                        };
                    }),
                success: true,
            });
        });
});
