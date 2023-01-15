import express from "express";

import { ResponseModel } from "../models/response";
import { IUser, UserModel } from "../models/user";
import { verifyUser } from "../utils/strategy";

export const responseRouter = express.Router();

responseRouter.get("/latest", verifyUser, async (req, res, next) => {
    const userId = (req.user as IUser)._id;

    const user = await UserModel.findById(userId);

    const responses = await ResponseModel.find({
        _id: { $in: user?.responses },
    })
        .sort({ time: -1 })
        .limit(10)
        .exec();

    res.json({
        responses: responses.map((r) => {
            return {
                id: r._id,
                time: r.time,
                type: r.type,
                data: r.data,
                followUps: r.followUps,
                feedback: r.feedback,
            };
        }),
        success: true,
    });
});

responseRouter.post("/set-feedback", verifyUser, async (req, res, next) => {
    const { rating, reason, responseId, followUpId } = req.body;
    const userId = (req.user as IUser)._id;

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
