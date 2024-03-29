import express from "express";
import { v4 as uuid } from "uuid";

import { ResponseModel } from "../models/response";
import { IUser, UserModel } from "../models/user";
import { verifyUser } from "../utils/strategy";

export const responseRouter = express.Router();

responseRouter.post("/init-response", verifyUser, async (req, res, next) => {
    const userId = (req.user as IUser)._id;
    const user = await UserModel.findById(userId);

    const { type } = req.body;

    const response = new ResponseModel({
        type,
    });

    const savedResponse = await response.save();

    if (savedResponse && user) {
        user.responses.push(savedResponse);
        // user.canUseToolbox = false;
        // user.generating = true;

        await user.save();

        res.json({
            id: savedResponse._id,
            success: true,
        });
    } else {
        res.json({
            success: false,
        });
    }
});

responseRouter.post("/init-follow-up", verifyUser, async (req, res, next) => {
    const userId = (req.user as IUser)._id;
    const user = await UserModel.findById(userId);

    const { id, len } = req.body;

    const response = await ResponseModel.findById(id);

    if (response?.followUps.length === len) {
        if (response) {
            const followUp = {
                id: uuid(),
                time: new Date(),
                data: {},
                question: "",
                finished: false,
            };

            response.followUps.push(followUp);
            await response.save();

            if (response) {
                res.json({
                    id: followUp.id,
                    success: true,
                });
            } else {
                res.json({
                    success: false,
                });
            }
        }
    } else {
        res.json({
            success: false,
        });
    }
});

responseRouter.get("/latest", verifyUser, async (req, res, next) => {
    const userId = (req.user as IUser)._id;

    const user = await UserModel.findById(userId);

    const responses = await ResponseModel.find({
        _id: { $in: user?.responses },
    })
        .sort({ time: -1 })
        .limit(30)
        .exec();

    if (responses) {
        res.json({
            responses: responses.map((r) => {
                return {
                    id: r._id,
                    time: r.time,
                    type: r.type,
                    data: r.data,
                    followUps: r.followUps,
                    feedback: r.feedback,
                    finished: r.finished,
                };
            }),
            success: true,
        });
    } else {
        res.json({
            success: false,
        });
    }
});

responseRouter.post("/set-feedback", verifyUser, async (req, res, next) => {
    const { rating, reason, responseId, followUpId } = req.body;
    const userId = (req.user as IUser)._id;

    try {
        const response = await ResponseModel.findById(responseId);
        const user = await UserModel.findById(userId);

        if (response && user) {
            if (followUpId) {
                const followUps = response.followUps;

                const followUpIndex = followUps.findIndex(
                    (f) => f.id === followUpId
                );

                if (followUpIndex !== -1) {
                    followUps[followUpIndex] = {
                        ...followUps[followUpIndex],
                        feedback: {
                            rating,
                            reason,
                            time: new Date(),
                        },
                    };
                }

                response.followUps = followUps;
            } else {
                response.feedback = {
                    rating,
                    reason,
                    time: new Date(),
                };
            }

            await response.save();

            user.canUseToolbox = true;
            await user.save();

            res.json({
                success: true,
            });
        } else {
            res.json({
                success: false,
            });
        }
    } catch (err) {
        console.log(err);

        res.json({
            success: false,
        });
    }
});

responseRouter.get("/can-use-toolbox", verifyUser, async (req, res, next) => {
    const userId = (req.user as IUser)._id;
    const user = await UserModel.findById(userId);

    if (user) {
        res.json({
            success: true,
            canUseToolbox: user.canUseToolbox,
        });
    } else {
        res.json({
            success: false,
        });
    }
});
