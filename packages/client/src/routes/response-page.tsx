import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { apiGetResponse } from "../api/admin-api";
import { AnalysisBox } from "../components/analysis-box";
import { Layout } from "../components/layout";
import { BreakDownStepsResponse } from "../components/responses/break-down-task-response";
import { ExplainCodeHoverResponse } from "../components/responses/explain-code-hover-response";
import { HelpFixCodeResponse } from "../components/responses/help-fix-code-response";
import { KeywordExampleResponse } from "../components/responses/keyword-example-response";
import { QuestionAnswerResponse } from "../components/responses/question-answer-response";
import { QuestionFromCodeResponse } from "../components/responses/question-from-code-response";
import { AuthContext } from "../context";

export const ResponsePage = () => {
    const { context, setContext } = useContext(AuthContext);

    const [response, setResponse] = useState<any>(null);

    const { id } = useParams();

    if (!id) {
        return <div>Invalid response id</div>;
    }

    useEffect(() => {
        apiGetResponse(context?.token, id).then(async (res) => {
            const data = await res.json();

            if (data.success) {
                setResponse({
                    ...data.response.data,
                    type: data.response.type,
                    id: data.response._id,
                    followUps: data.response.followUps,
                    feedback: data.response.feedback,
                    analysis: data.response.analysis,
                });
            }
        });
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
                    {response && (
                        <div>
                            {displayResponse(response)}
                            <AnalysisBox
                                responseId={response.id}
                                priorAnalysis={response.analysis}
                            ></AnalysisBox>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};