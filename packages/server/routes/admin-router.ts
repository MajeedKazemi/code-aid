import express from "express";

import { ResponseModel } from "../models/response";
import { IUser, UserModel } from "../models/user";
import { verifyUser } from "../utils/strategy";

export const adminRouter = express.Router();

adminRouter.get("/active-users/:hours", verifyUser, async (req, res, next) => {
    const user = req.user as IUser;
    const hours = parseInt(req.params.hours);

    if (user.role === "admin") {
        // find UserModel's that their responses array has a response that was created within the last X hours
        const users = await UserModel.find({
            responses: {
                $elemMatch: {
                    time: {
                        $gte: new Date(
                            new Date().getTime() - hours * 60 * 60 * 1000
                        ),
                    },
                },
            },
        }).exec();

        res.json({
            users: users.map((u) => {
                return {
                    id: u._id,
                    username: u.username,
                    firstName: u.firstName,
                    lastName: u.lastName,
                    responses: u.responses.map((r) => {
                        return {
                            id: r._id,
                            time: r.time,
                            type: r.type,
                            data: r.data,
                            followUps: r.followUps,
                            feedback: r.feedback,
                        };
                    }),
                };
            }),
        });
    } else {
        res.status(401).json({
            message: "unauthorized access to /admin/recent-responses",
            success: false,
        });
    }
});

adminRouter.get(
    "/recent-responses/:limit",
    verifyUser,
    async (req, res, next) => {
        const user = req.user as IUser;
        const limit = parseInt(req.params.limit);

        if (user.role === "admin") {
            const responses = await ResponseModel.find({})
                .sort({ time: -1 })
                .limit(limit)
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
        } else {
            res.status(401).json({
                message: "unauthorized access to /admin/recent-responses",
                success: false,
            });
        }
    }
);

adminRouter.get("/response-count", verifyUser, async (req, res, next) => {
    const countJustRating = await ResponseModel.countDocuments({
        feedback: { $ne: {} },
        "feedback.rating": { $ne: null },
    });

    const countWithReason = await ResponseModel.countDocuments({
        feedback: { $ne: {} },
        "feedback.rating": { $ne: null },
        "feedback.reason": { $ne: "" },
    });

    const totalCount = await ResponseModel.countDocuments({});

    if (totalCount) {
        res.json({
            countJustRating,
            countWithReason,
            totalCount,
            success: true,
        });
    }
});

adminRouter.get("/response-average", verifyUser, async (req, res, next) => {
    const average = await UserModel.aggregate([
        {
            $group: {
                _id: null,
                average: { $avg: { $size: "$responses" } },
            },
        },
    ]);

    if (average) {
        res.json({
            average: average[0].average,
            success: true,
        });
    }
});

adminRouter.get(
    "/response-count-histogram",
    verifyUser,
    async (req, res, next) => {
        const histogram = await UserModel.aggregate([
            {
                $group: {
                    _id: { $size: "$responses" },
                    count: { $sum: 1 },
                },
            },
            {
                $sort: {
                    _id: 1,
                },
            },
        ]);

        if (histogram) {
            res.json({
                histogram,
                success: true,
            });
        }
    }
);

adminRouter.get(
    "/recent-positive-feedback",
    verifyUser,
    async (req, res, next) => {
        // recent responses with non-empty (not empty JSON) feedback that have a rating of 4 or 5 and reason is not empty
        const responses = await ResponseModel.find({
            feedback: { $ne: {} },
            "feedback.rating": { $gte: 4 },
            "feedback.reason": { $ne: "" },
        })
            .sort({ "feedback.time": -1 })
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
        });
    }
);

adminRouter.get(
    "/recent-negative-feedback",
    verifyUser,
    async (req, res, next) => {
        // recent responses with non-empty (not empty JSON) feedback that have a rating of 4 or 5 and reason is not empty
        const responses = await ResponseModel.find({
            feedback: { $ne: {} },
            "feedback.rating": { $lte: 2 },
            "feedback.reason": { $ne: "" },
        })
            .sort({ "feedback.time": -1 })
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
        });
    }
);

adminRouter.get("/type-count-histogram", verifyUser, async (req, res, next) => {
    const histogram = await ResponseModel.aggregate([
        {
            $group: {
                _id: "$type",
                count: { $sum: 1 },
            },
        },
        {
            $sort: {
                _id: 1,
            },
        },
    ]);

    if (histogram) {
        res.json({
            histogram,
            success: true,
        });
    }
});

adminRouter.get("/last-week-histogram", verifyUser, async (req, res, next) => {
    // for the last seven days, get the number of responses per day
    // then, for each day, group by $type (total number of responses per day per type)
    // then inside each type, group by $feedback.rating (either 1, 2, 3, 4, or 5)

    const histogram = await ResponseModel.aggregate([
        {
            $match: {
                time: {
                    $gte: new Date(
                        new Date().getTime() - 10 * 24 * 60 * 60 * 1000
                    ),
                },
            },
        },
        {
            $group: {
                _id: {
                    $dateToString: {
                        format: "%Y-%m-%d",
                        date: "$time",
                    },
                },
                count: { $sum: 1 },
            },
        },
        {
            $sort: {
                _id: 1,
            },
        },
    ]);

    if (histogram) {
        res.json({
            histogram,
            success: true,
        });
    } else {
        res.status(500).json({
            message: "error getting histogram",
            success: false,
        });
    }
});

adminRouter.get("/average-rating-type", verifyUser, async (req, res, next) => {
    // for each type, get the average rating in the last seven days
    const average = await ResponseModel.aggregate([
        {
            $match: {
                time: {
                    $gte: new Date(
                        new Date().getTime() - 10 * 24 * 60 * 60 * 1000
                    ),
                },
            },
        },
        {
            $group: {
                _id: "$type",
                average: { $avg: "$feedback.rating" },
            },
        },
        {
            $sort: {
                _id: 1,
            },
        },
    ]);

    if (average) {
        res.json({
            average,
            success: true,
        });
    } else {
        res.status(500).json({
            message: "error getting average",
            success: false,
        });
    }
});
