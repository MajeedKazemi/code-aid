import React, { useContext, useEffect, useState } from "react";

import {
    apiGetActiveUsers,
    apiGetAllResponsesRawData,
    apiGetAnalyzedPercentages,
    apiGetAnalyzedResponsesRawData,
    apiGetAverageRatingByType,
    apiGetLastWeekHistogram,
    apiGetLatestAnalyzedResponses,
    apiGetRecentResponses,
    apiGetRecentResponsesWithNegativeFeedback,
    apiGetRecentResponsesWithPositiveFeedback,
    apiGetResponseAverage,
    apiGetResponseCount,
    apiGetResponseCountHistogram,
    apiGetResponseTypeHistogram,
    apiGetStudentUsage,
} from "../api/admin-api";
import { AnalysisBox } from "../components/analysis-box";
import { Layout } from "../components/layout";
import { AuthContext } from "../context";
import { getAdminComponentFromResponse } from "./response-page";

export const SummaryPage = () => {
    const { context, setContext } = useContext(AuthContext);
    const [countAnalyzed, setCountAnalyzed] = useState(0);
    const [analyzedResponses, setAnalyzedResponses] = useState<any[]>([]);
    const [skipCount, setSkipCount] = useState(0);

    useEffect(() => {
        apiGetLatestAnalyzedResponses(context?.token, skipCount).then(
            async (res) => {
                const data = await res.json();

                if (data.success) {
                    setAnalyzedResponses(
                        data.responses.map((it: any) => {
                            return {
                                ...it.data,
                                type: it.type,
                                id: it.id,
                                followUps: it.followUps,
                                feedback: it.feedback,
                                analysis: it.analysis,
                            };
                        })
                    );

                    setSkipCount(data.responses.length + skipCount);
                    setCountAnalyzed(data.countAnalyzed);
                }
            }
        );
    }, []);

    return (
        <Layout>
            <div>
                <div className="analyzed-responses-container">
                    {analyzedResponses.map((response) => (
                        <div>
                            {getAdminComponentFromResponse(response)}
                            <AnalysisBox
                                type={response.type}
                                responseId={response.id}
                                priorAnalysis={response.analysis}
                            ></AnalysisBox>
                        </div>
                    ))}
                </div>

                <button
                    onClick={() => {
                        apiGetLatestAnalyzedResponses(
                            context?.token,
                            skipCount
                        ).then(async (res) => {
                            const data = await res.json();

                            if (data.success) {
                                setAnalyzedResponses(
                                    data.responses.map((it: any) => {
                                        return {
                                            ...it.data,
                                            type: it.type,
                                            id: it.id,
                                            followUps: it.followUps,
                                            feedback: it.feedback,
                                            analysis: it.analysis,
                                        };
                                    })
                                );

                                setSkipCount(data.responses.length + skipCount);
                                setCountAnalyzed(data.countAnalyzed);
                            }
                        });
                    }}
                >
                    get next page
                </button>
            </div>
            <div className="admin-dashboard-main-container">
                <div className="admin-dashboard-column">
                    <h2>Active Users</h2>
                    <button
                        onClick={() => {
                            apiGetActiveUsers(context?.token).then(
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

                <div className="admin-dashboard-column">
                    <h2>Analyzed by type</h2>
                    <button
                        onClick={() => {
                            apiGetAnalyzedPercentages(context?.token).then(
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
                    <h2>Expprt Analyzed Responses Raw Data</h2>
                    <button
                        onClick={() => {
                            apiGetAnalyzedResponsesRawData(context?.token).then(
                                async (res) => {
                                    const data = await res.json();

                                    const element = document.createElement("a");
                                    const file = new Blob(
                                        [JSON.stringify(data)],
                                        { type: "text/plain" }
                                    );
                                    element.href = URL.createObjectURL(file);
                                    element.download = "data-analyzed.json";
                                    document.body.appendChild(element); // Required for this to work in FireFox
                                    element.click();
                                }
                            );
                        }}
                    >
                        Get
                    </button>
                </div>

                <div className="admin-dashboard-column">
                    <h2>Expprt All Responses Raw Data</h2>
                    <button
                        onClick={() => {
                            apiGetAllResponsesRawData(context?.token).then(
                                async (res) => {
                                    const data = await res.json();

                                    const element = document.createElement("a");
                                    const file = new Blob(
                                        [JSON.stringify(data)],
                                        { type: "text/plain" }
                                    );
                                    element.href = URL.createObjectURL(file);
                                    element.download = "data-all.json";
                                    document.body.appendChild(element); // Required for this to work in FireFox
                                    element.click();
                                }
                            );
                        }}
                    >
                        Get
                    </button>
                </div>

                <div className="admin-dashboard-column">
                    <h2>Expprt All Student Usage</h2>
                    <button
                        onClick={() => {
                            apiGetStudentUsage(context?.token).then(
                                async (res) => {
                                    const data = await res.json();

                                    const element = document.createElement("a");
                                    const file = new Blob(
                                        [JSON.stringify(data)],
                                        { type: "text/plain" }
                                    );
                                    element.href = URL.createObjectURL(file);
                                    element.download = "student-usage.json";
                                    document.body.appendChild(element); // Required for this to work in FireFox
                                    element.click();
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
