import React, { useContext, useEffect, useState } from "react";

import {
    apiGetAllResponsesRawData,
    apiGetAllStudentData,
    apiGetLatestAnalyzedResponses,
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

                <div className="admin-dashboard-column">
                    <h2>Expprt All Responses</h2>
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
                                    element.download = "all-responses.json";
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
                    <h2>Expprt All User Data and Responses</h2>
                    <button
                        onClick={() => {
                            apiGetAllStudentData(context?.token).then(
                                async (res) => {
                                    const data = await res.json();

                                    const element = document.createElement("a");
                                    const file = new Blob(
                                        [JSON.stringify(data)],
                                        { type: "text/plain" }
                                    );
                                    element.href = URL.createObjectURL(file);
                                    element.download =
                                        "all-users-and-responses.json";
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
