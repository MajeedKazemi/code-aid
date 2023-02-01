import React, { useContext, useEffect, useState } from "react";

import {
    apiGetActiveUsers,
    apiGetAverageRatingByType,
    apiGetLastWeekHistogram,
    apiGetRecentResponses,
    apiGetRecentResponsesWithNegativeFeedback,
    apiGetRecentResponsesWithPositiveFeedback,
    apiGetResponseAverage,
    apiGetResponseCount,
    apiGetResponseCountHistogram,
    apiGetResponseTypeHistogram,
} from "../api/admin-api";
import { Layout } from "../components/layout";
import { AuthContext } from "../context";

export const AdminPage = () => {
    const { context, setContext } = useContext(AuthContext);
    const [activeUsersHours, setActiveUsersHours] = useState(24);

    return (
        <Layout>
            <div className="admin-dashboard-main-container">
                <div className="admin-dashboard-column">
                    <h2>Active Users</h2>
                    <input
                        onChange={(e) => {
                            setActiveUsersHours(Number(e.target.value));
                        }}
                        value={activeUsersHours}
                    ></input>
                    <button
                        onClick={() => {
                            apiGetActiveUsers(
                                context?.token,
                                activeUsersHours
                            ).then(async (res) => {
                                const data = await res.json();

                                console.log(data);
                            });
                        }}
                    >
                        Get
                    </button>
                </div>
                <div className="admin-dashboard-column">
                    <h2>Recent Responses</h2>
                    <button
                        onClick={() => {
                            apiGetRecentResponses(context?.token, 10).then(
                                async (res) => {
                                    const data = await res.json();

                                    console.log(data);
                                }
                            );
                        }}
                    >
                        Get
                    </button>
                </div>
                <div className="admin-dashboard-column">
                    <h2>Total Rsponse Count</h2>
                    <button
                        onClick={() => {
                            apiGetResponseCount(context?.token).then(
                                async (res) => {
                                    const data = await res.json();

                                    console.log(data);
                                }
                            );
                        }}
                    >
                        Get
                    </button>
                </div>
                <div className="admin-dashboard-column">
                    <h2>Average Rsponse Count</h2>
                    <button
                        onClick={() => {
                            apiGetResponseAverage(context?.token).then(
                                async (res) => {
                                    const data = await res.json();

                                    console.log(data);
                                }
                            );
                        }}
                    >
                        Get
                    </button>
                </div>

                <div className="admin-dashboard-column">
                    <h2>Average Rsponse Count Histogram</h2>
                    <button
                        onClick={() => {
                            apiGetResponseCountHistogram(context?.token).then(
                                async (res) => {
                                    const data = await res.json();

                                    console.log(data);
                                }
                            );
                        }}
                    >
                        Get
                    </button>
                </div>

                <div className="admin-dashboard-column">
                    <h2>Response Types Histogram</h2>
                    <button
                        onClick={() => {
                            apiGetResponseTypeHistogram(context?.token).then(
                                async (res) => {
                                    const data = await res.json();

                                    console.log(data);
                                }
                            );
                        }}
                    >
                        Get
                    </button>
                </div>

                <div className="admin-dashboard-column">
                    <h2>Last Week Histogram</h2>
                    <button
                        onClick={() => {
                            apiGetLastWeekHistogram(context?.token).then(
                                async (res) => {
                                    const data = await res.json();

                                    console.log(data);
                                }
                            );
                        }}
                    >
                        Get
                    </button>
                </div>

                <div className="admin-dashboard-column">
                    <h2>Negative Feedback</h2>
                    <button
                        onClick={() => {
                            apiGetRecentResponsesWithNegativeFeedback(
                                context?.token
                            ).then(async (res) => {
                                const data = await res.json();

                                console.log(data);
                            });
                        }}
                    >
                        Get
                    </button>
                </div>
                <div className="admin-dashboard-column">
                    <h2>Positive Feedback</h2>
                    <button
                        onClick={() => {
                            apiGetRecentResponsesWithPositiveFeedback(
                                context?.token
                            ).then(async (res) => {
                                const data = await res.json();

                                console.log(data);
                            });
                        }}
                    >
                        Get
                    </button>
                </div>
                <div className="admin-dashboard-column">
                    <h2>Average Rating by Type</h2>
                    <button
                        onClick={() => {
                            apiGetAverageRatingByType(context?.token).then(
                                async (res) => {
                                    const data = await res.json();

                                    console.log(data);
                                }
                            );
                        }}
                    >
                        Get
                    </button>
                </div>
            </div>
        </Layout>
    );
};
