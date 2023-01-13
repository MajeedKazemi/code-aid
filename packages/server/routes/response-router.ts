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
    const { rating, reason, responseId } = req.body;

    const response = await ResponseModel.findById(responseId);

    if (response) {
        response.feedback = {
            rating,
            reason,
            time: new Date(),
        };

        await response.save();

        res.json({
            success: true,
        });
    }
});
