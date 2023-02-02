import React, { useContext, useEffect, useState } from "react";

import {
    apiGetActiveUsers,
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
} from "../api/admin-api";
import { AnalysisBox } from "../components/analysis-box";
import { Layout } from "../components/layout";
import { BreakDownStepsResponse } from "../components/responses/break-down-task-response";
import { ExplainCodeHoverResponse } from "../components/responses/explain-code-hover-response";
import { HelpFixCodeResponse } from "../components/responses/help-fix-code-response";
import { KeywordExampleResponse } from "../components/responses/keyword-example-response";
import { QuestionAnswerResponse } from "../components/responses/question-answer-response";
import { QuestionFromCodeResponse } from "../components/responses/question-from-code-response";
import { AuthContext } from "../context";

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

    const displayResponse = (response: any) => {
        switch (response.type) {
            case "question-answer":
                return (
                    <QuestionAnswerResponse
                        admin
                        key={response.id}
                        data={response}
                        canUseToolbox={false}
                    />
                );

            case "break-down-steps":
                return (
                    <BreakDownStepsResponse
                        admin
                        key={response.id}
                        data={response}
                        canUseToolbox={false}
                    />
                );

            case "help-fix-code":
                return (
                    <HelpFixCodeResponse
                        admin
                        key={response.id}
                        data={response}
                        canUseToolbox={false}
                    />
                );

            case "explain-code-hover":
                return (
                    <ExplainCodeHoverResponse
                        admin
                        key={response.id}
                        data={response}
                        canUseToolbox={false}
                    />
                );

            case "question-from-code":
                return (
                    <QuestionFromCodeResponse
                        admin
                        key={response.id}
                        data={response}
                        canUseToolbox={false}
                    />
                );

            case "keyword-example":
                return (
                    <KeywordExampleResponse key={response.id} data={response} />
                );

            default:
                return null;
        }
    };

    return (
        <Layout>
            <div>
                <div className="analyzed-responses-container">
                    {analyzedResponses.map((response) => (
                        <div>
                            {displayResponse(response)}
                            <AnalysisBox
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
            </div>
        </Layout>
    );
};
