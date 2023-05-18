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

const responseIdsCache1 = {
    responses: new Array(),
    lastUpdated: new Date(0),
};

const responseIdsCache2 = {
    responses: new Array(),
    lastUpdated: new Date(0),
};

adminRouter.post(
    "/get-random-response-to-analyze",
    verifyUser,
    async (req, res, next) => {
        const user = req.user as IUser;

        if (user.role === "admin") {
            const { type, tag, timePeriod } = req.body;

            if (
                responseIdsCache1.lastUpdated.getTime() <
                new Date().getTime() - 1000 * 60 * 60 * 24
            ) {
                // should update cache
                responseIdsCache1.lastUpdated = new Date();

                ResponseModel.find({
                    canUseInResearch: true,
                })
                    .exec()
                    .then((responses) => {
                        for (const response of responses) {
                            responseIdsCache1.responses.push({
                                tags: response.tags,
                                id: response._id,
                                type: response.type,
                                time: response.time,
                                feedback: response.feedback,
                                followUpCount: response.followUps.length,
                                analyzed: response.analysis.analyzed,
                            });
                        }
                    });
            }

            if (
                responseIdsCache2.lastUpdated.getTime() <
                new Date().getTime() - 1000 * 60 * 60 * 24
            ) {
                // should update cache
                responseIdsCache2.lastUpdated = new Date();

                ResponseModel.find({
                    canUseInResearch: true,
                    "analysis.analyzed": true,
                })
                    .exec()
                    .then((responses) => {
                        for (const response of responses) {
                            responseIdsCache2.responses.push({
                                tags: response.tags,
                                id: response._id,
                                type: response.type,
                                time: response.time,
                                feedback: response.feedback,
                                followUpCount: response.followUps.length,
                                analyzed: response.analysis2.analyzed,
                            });
                        }
                    });
            }

            let cache = responseIdsCache1;

            if (user.username === "harryye") {
                // use analysis (1)
                cache = responseIdsCache1;
            } else if (user.username === "mcraig") {
                // use analysis2
                cache = responseIdsCache2;
            }

            let analyzedCount = cache.responses.filter(
                (r) => r.analyzed
            ).length;
            let totalCount = cache.responses.length;

            // can randomly select from cache
            const filteredResponses = cache.responses.filter((r) => {
                let shouldInclude = !r.analyzed;

                if (type && type !== "any") {
                    shouldInclude = shouldInclude && r.type === type;
                }

                if (tag && tag !== "any") {
                    shouldInclude = shouldInclude && r.tags.includes(tag);
                }

                if (timePeriod && timePeriod !== "any") {
                    // week1-lab1 -> start: Jan 6 2023 -> end: Jan 13 2023
                    // week2-lab2 -> start: Jan 13 2023 -> end: Jan 20 2023
                    // week3-lab3 -> start: Jan 20 2023 -> end: Jan 27 2023
                    // week4-lab4-a1 -> start: Jan 27 2023 -> end: Feb 3 2023
                    // week5-lab5 -> start: Feb 3 2023 -> end: Feb 10 2023
                    // week6-lab6-a2 -> start: Feb 10 2023 -> end: Feb 17 2023
                    // week7-lab7 -> start: Feb 17 2023 -> end: Mar 3 2023
                    // week8-lab8 -> start: Mar 3 2023 -> end: Mar 10 2023
                    // week9-lab9-a3 -> start: Mar 10 2023 -> end: Mar 17 2023
                    // week10-lab10 -> start: Mar 17 2023 -> end: Mar 24 2023
                    // week11-lab11 -> start: Mar 24 2023 -> end: Mar 31 2023
                    // week12-lab12-a4 -> start: Mar 31 2023 -> end: Apr 7 2023
                    // final -> start: Apr 7 2023 -> end: Apr 25 2023

                    const now = new Date();

                    const week1Lab1Start = new Date("Jan 6 2023");
                    const week1Lab1End = new Date("Jan 13 2023");

                    const week2Lab2Start = new Date("Jan 13 2023");
                    const week2Lab2End = new Date("Jan 20 2023");

                    const week3Lab3Start = new Date("Jan 20 2023");
                    const week3Lab3End = new Date("Jan 27 2023");

                    const week4Lab4A1Start = new Date("Jan 27 2023");
                    const week4Lab4A1End = new Date("Feb 3 2023");

                    const week5Lab5Start = new Date("Feb 3 2023");
                    const week5Lab5End = new Date("Feb 10 2023");

                    const week6Lab6A2Start = new Date("Feb 10 2023");
                    const week6Lab6A2End = new Date("Feb 17 2023");

                    const week7Lab7Start = new Date("Feb 17 2023");
                    const week7Lab7End = new Date("Mar 3 2023");

                    const week8Lab8Start = new Date("Mar 3 2023");
                    const week8Lab8End = new Date("Mar 10 2023");

                    const week9Lab9A3Start = new Date("Mar 10 2023");
                    const week9Lab9A3End = new Date("Mar 17 2023");

                    const week10Lab10Start = new Date("Mar 17 2023");
                    const week10Lab10End = new Date("Mar 24 2023");

                    const week11Lab11Start = new Date("Mar 24 2023");
                    const week11Lab11End = new Date("Mar 31 2023");

                    const week12Lab12A4Start = new Date("Mar 31 2023");
                    const week12Lab12A4End = new Date("Apr 7 2023");

                    const finalStart = new Date("Apr 7 2023");
                    const finalEnd = new Date("Apr 25 2023");

                    let start: Date;
                    let end: Date;

                    switch (timePeriod) {
                        case "week1-lab1":
                            start = week1Lab1Start;
                            end = week1Lab1End;
                            break;

                        case "week2-lab2":
                            start = week2Lab2Start;
                            end = week2Lab2End;
                            break;

                        case "week3-lab3":
                            start = week3Lab3Start;
                            end = week3Lab3End;
                            break;

                        case "week4-lab4-a1":
                            start = week4Lab4A1Start;
                            end = week4Lab4A1End;
                            break;

                        case "week5-lab5":
                            start = week5Lab5Start;
                            end = week5Lab5End;
                            break;

                        case "week6-lab6-a2":
                            start = week6Lab6A2Start;
                            end = week6Lab6A2End;
                            break;

                        case "week7-lab7":
                            start = week7Lab7Start;
                            end = week7Lab7End;
                            break;

                        case "week8-lab8":
                            start = week8Lab8Start;
                            end = week8Lab8End;
                            break;

                        case "week9-lab9-a3":
                            start = week9Lab9A3Start;
                            end = week9Lab9A3End;
                            break;

                        case "week10-lab10":
                            start = week10Lab10Start;
                            end = week10Lab10End;
                            break;

                        case "week11-lab11":
                            start = week11Lab11Start;
                            end = week11Lab11End;
                            break;

                        case "week12-lab12-a4":
                            start = week12Lab12A4Start;
                            end = week12Lab12A4End;
                            break;

                        case "final":
                            start = finalStart;
                            end = finalEnd;
                            break;

                        default:
                            start = week1Lab1Start;
                            end = finalEnd;
                            break;
                    }

                    shouldInclude =
                        shouldInclude && r.time >= start && r.time <= end;
                }

                return shouldInclude;
            });

            let success = false;

            if (filteredResponses.length > 0) {
                const randomResponse =
                    filteredResponses[
                        Math.floor(Math.random() * filteredResponses.length)
                    ];

                if (randomResponse) {
                    const response = await ResponseModel.findById(
                        randomResponse.id
                    ).exec();

                    success = true;

                    res.json({
                        analyzedCount,
                        totalCount,
                        response,
                        success,
                    });
                }
            }

            if (!success) {
                res.json({
                    success: false,
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

            let cache = responseIdsCache1;
            let response;

            if (user.username === "harryye") {
                // use analysis (1)
                cache = responseIdsCache1;

                response = await ResponseModel.findByIdAndUpdate(responseId, {
                    analysis: {
                        likertScales,
                        time: new Date(),
                        notes,
                        admin: user.username,
                        analyzed: true,
                    },
                }).exec();
            } else if (user.username === "mcraig") {
                // use analysis2
                cache = responseIdsCache2;

                response = await ResponseModel.findByIdAndUpdate(responseId, {
                    analysis2: {
                        likertScales,
                        time: new Date(),
                        notes,
                        admin: user.username,
                        analyzed: true,
                    },
                }).exec();
            }

            // update response in cache as well:
            const responseInCache = cache.responses.find(
                (r) => r.id === responseId
            );

            if (responseInCache) {
                responseInCache.analyzed = true;
            }

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
                "analysis.analyzed": true,
            });

            const responses = await ResponseModel.find({
                "analysis.analyzed": true,
                canUseInResearch: true,
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

adminRouter.get("/get-analyzed-count", verifyUser, async (req, res, next) => {
    const user = req.user as IUser;

    if (user.role === "admin") {
        const analyzed1 = await ResponseModel.countDocuments({
            "analysis.analyzed": true,
            canUseInResearch: true,
        }).exec();

        const analyzed2 = await ResponseModel.countDocuments({
            "analysis2.analyzed": true,
            canUseInResearch: true,
        }).exec();

        if (analyzed1 && analyzed2) {
            res.json({
                analyzed1,
                analyzed2,
                success: true,
            });
        }
    } else {
        res.status(401).json({
            message: "unauthorized access to /admin/get-analyzed-count",
            success: false,
        });
    }
});

adminRouter.get(
    "/get-analyzed-responses-raw-data",
    verifyUser,
    async (req, res, next) => {
        const user = req.user as IUser;

        if (user.role === "admin") {
            const responses = await ResponseModel.find({
                "analysis.analyzed": true,
                canUseInResearch: true,
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

adminRouter.get("/get-all-student-data", verifyUser, async (req, res, next) => {
    const user = req.user as IUser;

    if (user.role === "admin") {
        // get all users
        const users = await UserModel.find({}).exec();

        if (users) {
            res.json({
                users,
                success: true,
            });
        }
    } else {
        res.status(401).json({
            message: "unauthorized access to /admin/get-all-student-data",
            success: false,
        });
    }
});

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
