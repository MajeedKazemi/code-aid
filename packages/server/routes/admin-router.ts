import express from "express";

import { ResponseModel } from "../models/response";
import { IUser, UserModel } from "../models/user";
import { verifyUser } from "../utils/strategy";

export const adminRouter = express.Router();

adminRouter.post("/update-user-role", verifyUser, async (req, res, next) => {
    const user = req.user as IUser;

    if (user.role === "admin") {
        const { userId, role } = req.body;

        const updatedUser = await UserModel.findByIdAndUpdate(userId, {
            role,
        }).exec();

        if (updatedUser) {
            res.json({
                user: {
                    id: updatedUser._id,
                    username: updatedUser.username,
                    firstName: updatedUser.firstName,
                    lastName: updatedUser.lastName,
                    role: updatedUser.role,
                },
            });
        } else {
            res.statusCode = 404;
            res.send({
                name: "UserNotFoundError",
                message: "User not found",
            });
        }
    } else {
        res.statusCode = 403;
        res.send({
            name: "Forbidden",
            message: "You are not authorized to perform this action",
        });
    }
});

adminRouter.get("/active-users", verifyUser, async (req, res, next) => {
    const user = req.user as IUser;

    if (user.role === "admin") {
        const users = await UserModel.find({
            "responses.19": { $exists: true },
        }).exec();

        if (users) {
            res.json({
                users: users.map((u) => {
                    return {
                        id: u._id,
                        username: u.username,
                        firstName: u.firstName,
                        lastName: u.lastName,
                        responses: u.responses.length,
                    };
                }),
            });
        } else {
            res.statusCode = 404;
            res.send({
                name: "UserNotFoundError",
                message: "User not found",
            });
        }
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
    const user = req.user as IUser;

    if (user.role === "admin") {
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
    } else {
        res.status(401).json({
            message: "unauthorized access to /admin/response-count",
            success: false,
        });
    }
});

adminRouter.get("/response-average", verifyUser, async (req, res, next) => {
    const user = req.user as IUser;

    if (user.role === "admin") {
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
    } else {
        res.status(401).json({
            message: "unauthorized access to /admin/response-average",
            success: false,
        });
    }
});

adminRouter.get(
    "/response-count-histogram",
    verifyUser,
    async (req, res, next) => {
        const user = req.user as IUser;

        if (user.role === "admin") {
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

            // hist2 to be bracketed by 0-9, 10-19, 20-29, 30-39, 40-49, 50-59, 60-69, 70-79, 80-89, 90-99, 100+
            const brackets2 = [
                { min: 0, max: 0, label: "Not Used" },
                { min: 1, max: 9, label: "1-9" },
                { min: 10, max: 19, label: "10-19" },
                { min: 20, max: 29, label: "20-29" },
                { min: 30, max: 39, label: "30-39" },
                { min: 40, max: 49, label: "40-49" },
                { min: 50, max: 59, label: "50-59" },
                { min: 60, max: 69, label: "60-69" },
                { min: 70, max: 79, label: "70-79" },
                { min: 80, max: 89, label: "80-89" },
                { min: 90, max: 99, label: "90-99" },
                { min: 100, max: 100000, label: "100+" },
            ];

            const hist2 = brackets2.map((b) => {
                const count = histogram
                    .filter((h) => {
                        return h._id >= b.min && h._id <= b.max;
                    })
                    .reduce((acc, curr) => {
                        return acc + curr.count;
                    }, 0);

                return {
                    label: b.label,
                    count,
                };
            });

            if (histogram) {
                res.json({
                    hist2,
                    histogram,
                    success: true,
                });
            }
        } else {
            res.status(401).json({
                message:
                    "unauthorized access to /admin/response-count-histogram",
                success: false,
            });
        }
    }
);

adminRouter.get(
    "/recent-positive-feedback",
    verifyUser,
    async (req, res, next) => {
        const user = req.user as IUser;

        if (user.role === "admin") {
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
        } else {
            res.status(401).json({
                message:
                    "unauthorized access to /admin/recent-positive-feedback",
                success: false,
            });
        }
    }
);

adminRouter.get(
    "/recent-negative-feedback",
    verifyUser,
    async (req, res, next) => {
        const user = req.user as IUser;

        if (user.role === "admin") {
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
        } else {
            res.status(401).json({
                message:
                    "unauthorized access to /admin/recent-negative-feedback",
                success: false,
            });
        }
    }
);

adminRouter.get("/type-count-histogram", verifyUser, async (req, res, next) => {
    const user = req.user as IUser;

    if (user.role === "admin") {
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
    } else {
        res.status(401).json({
            message: "unauthorized access to /admin/type-count-histogram",
            success: false,
        });
    }
});

adminRouter.get("/last-week-histogram", verifyUser, async (req, res, next) => {
    const user = req.user as IUser;

    if (user.role === "admin") {
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
    } else {
        res.status(401).json({
            message: "unauthorized access to /admin/last-week-histogram",
            success: false,
        });
    }
});

adminRouter.get("/average-rating-type", verifyUser, async (req, res, next) => {
    const user = req.user as IUser;

    if (user.role === "admin") {
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
    } else {
        res.status(401).json({
            message: "unauthorized access to /admin/average-rating-type",
            success: false,
        });
    }
});

adminRouter.post(
    "/get-random-response-to-analyze",
    verifyUser,
    async (req, res, next) => {
        const user = req.user as IUser;

        if (user.role === "admin") {
            const { type, rating, withReason } = req.body;

            const agg = await ResponseModel.aggregate([
                {
                    $match: {
                        type: type ? { $eq: type } : { $exists: true },
                        "feedback.rating":
                            rating == 0 ? { $exists: true } : { $eq: rating },
                        "feedback.reason": withReason
                            ? { $ne: "" }
                            : { $exists: true },
                        analysis: { $exists: false },
                    },
                },
                {
                    $sample: { size: 1 },
                },
            ]).exec();

            if (agg.length > 0) {
                res.json({
                    response: agg[0],
                    success: true,
                });
            } else {
                res.json({
                    response: null,
                    success: true,
                });
            }
        } else {
            res.status(401).json({
                message:
                    "unauthorized access to /admin/get-random-response-to-analyze",
                success: false,
            });
        }
    }
);

adminRouter.post(
    "/set-response-analysis",
    verifyUser,
    async (req, res, next) => {
        const user = req.user as IUser;

        if (user.role === "admin") {
            const { responseId, likertScales, notes } = req.body;

            const response = await ResponseModel.findByIdAndUpdate(responseId, {
                analysis: {
                    likertScales,
                    time: new Date(),
                    notes,
                    admin: user.username,
                },
            }).exec();

            if (response) {
                res.json({
                    success: true,
                });
            } else {
                res.status(500).json({
                    message: "error updating response",
                    success: false,
                });
            }
        } else {
            res.status(401).json({
                message: "unauthorized access to /admin/set-response-analysis",
                success: false,
            });
        }
    }
);

adminRouter.get(
    "/get-latest-analyzed-responses/:skip",
    verifyUser,
    async (req, res, next) => {
        const user = req.user as IUser;

        if (user.role === "admin") {
            const { skip } = req.params;

            const countAnalyzed = await ResponseModel.countDocuments({
                "analysis.admin": { $exists: true },
            });

            const responses = await ResponseModel.find({
                "analysis.admin": { $exists: true },
            })
                .sort({ "analysis.time": -1 })
                .skip(parseInt(skip))
                .limit(10)
                .exec();

            if (responses) {
                res.json({
                    countAnalyzed,
                    responses: responses.map((r) => {
                        return {
                            id: r._id,
                            time: r.time,
                            type: r.type,
                            data: r.data,
                            followUps: r.followUps,
                            feedback: r.feedback,
                            analysis: r.analysis,
                        };
                    }),
                    success: true,
                });
            } else {
                res.status(500).json({
                    message: "error getting responses",
                    success: false,
                });
            }
        } else {
            res.status(401).json({
                message:
                    "unauthorized access to /admin/get-latest-analyzed-responses",
                success: false,
            });
        }
    }
);

adminRouter.get("/get-response/:id", verifyUser, async (req, res, next) => {
    const user = req.user as IUser;

    if (user.role === "admin") {
        const { id } = req.params;

        const response = await ResponseModel.findById(id).exec();

        if (response) {
            res.json({
                response,
                success: true,
            });
        } else {
            res.status(404).json({
                message: "response not found",
                success: false,
            });
        }
    } else {
        res.status(401).json({
            message: "unauthorized access to /admin/get-response",
            success: false,
        });
    }
});

adminRouter.get(
    "/get-analyzed-percentages",
    verifyUser,
    async (req, res, next) => {
        const user = req.user as IUser;

        if (user.role === "admin") {
            // for each type of response, get the number of responses that have been analyzed and the total number of responses
            const analyzed = await ResponseModel.aggregate([
                {
                    $group: {
                        _id: "$type",
                        analyzed: { $sum: { $cond: ["$analysis", 1, 0] } },
                        total: { $sum: 1 },
                    },
                },
            ]).exec();

            if (analyzed) {
                res.json({
                    analyzed,
                    success: true,
                });
            }
        } else {
            res.status(401).json({
                message:
                    "unauthorized access to /admin/get-analyzed-percentages",
                success: false,
            });
        }
    }
);

adminRouter.get(
    "/get-analyzed-responses-raw-data",
    verifyUser,
    async (req, res, next) => {
        const user = req.user as IUser;

        if (user.role === "admin") {
            const responses = await ResponseModel.find({
                "analysis.admin": { $exists: true },
            }).exec();

            if (responses) {
                res.json({
                    responses,
                    success: true,
                });
            }
        } else {
            res.status(401).json({
                message:
                    "unauthorized access to /admin/get-analyzed-responses-raw-data",
                success: false,
            });
        }
    }
);

adminRouter.get(
    "/get-all-responses-raw-data",
    verifyUser,
    async (req, res, next) => {
        const user = req.user as IUser;

        if (user.role === "admin") {
            // get all responses
            const responses = await ResponseModel.find({}).exec();

            if (responses) {
                res.json({
                    responses,
                    success: true,
                });
            }
        } else {
            res.status(401).json({
                message:
                    "unauthorized access to /admin/get-all-responses-raw-data",
                success: false,
            });
        }
    }
);

adminRouter.get(
    "/get-student-usage-data",
    verifyUser,
    async (req, res, next) => {
        const user = req.user as IUser;

        if (user.role === "admin") {
            // get the count of responses for each User:
            const users = await UserModel.find({}).exec();

            const responses = [];

            for (let i = 0; i < users.length; i++) {
                const user = users[i];

                const r: any = {};

                for (let j = 0; j < user.responses.length; j++) {
                    const response = user.responses[j];

                    if (r[response.type]) {
                        r[response.type] += 1;
                    } else {
                        r[response.type] = 1;
                    }
                }

                responses.push({
                    firstName: user.firstName,
                    lastName: user.lastName,
                    username: user.username,
                    responses: r,
                    count: user.responses.length,
                });
            }

            // sort by number of responses
            responses.sort((a, b) => {
                return b.count - a.count;
            });

            if (responses) {
                res.json({
                    responses,
                    success: true,
                });
            }
        } else {
            res.status(401).json({
                message: "unauthorized access to /admin/get-student-usage-data",
                success: false,
            });
        }
    }
);
