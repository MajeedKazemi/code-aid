import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { apiGetResponse } from "../api/admin-api";
import { AnalysisBox } from "../components/analysis-box";
import { Layout } from "../components/layout";
import { AskFromCodeResponse } from "../components/responses-socket/ask-from-code";
import { AskQuestionResponse } from "../components/responses-socket/ask-question";
import { ExplainCodeV2Response } from "../components/responses-socket/explain-code";
import { FixCodeResponse } from "../components/responses-socket/fix-code";
import { WriteCodeResponse } from "../components/responses-socket/write-code";
import { BreakDownStepsResponse } from "../components/responses/break-down-task-response";
import { ExplainCodeHoverResponse } from "../components/responses/explain-code-hover-response";
import { HelpFixCodeResponse } from "../components/responses/help-fix-code-response";
import { KeywordExampleResponse } from "../components/responses/keyword-example-response";
import { QuestionAnswerResponse } from "../components/responses/question-answer-response";
import { QuestionFromCodeResponse } from "../components/responses/question-from-code-response";
import { AuthContext } from "../context";

export const getAdminComponentFromResponse = (response: any) => {
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
            return <KeywordExampleResponse key={response.id} data={response} />;

        case "ask-question-v2":
            return (
                <AskQuestionResponse
                    admin
                    key={response.id}
                    data={response}
                    canUseToolbox={false}
                />
            );

        case "question-from-code-v2":
            return (
                <AskFromCodeResponse
                    admin
                    key={response.id}
                    data={response}
                    canUseToolbox={false}
                />
            );

        case "explain-code-v2":
            return (
                <ExplainCodeV2Response
                    admin
                    key={response.id}
                    data={response}
                    canUseToolbox={false}
                />
            );

        case "write-code-v2":
            return (
                <WriteCodeResponse
                    admin
                    key={response.id}
                    data={response}
                    canUseToolbox={false}
                />
            );

        case "help-fix-code-v2":
            return (
                <FixCodeResponse
                    admin
                    key={response.id}
                    data={response}
                    canUseToolbox={false}
                />
            );

        default:
            return null;
    }
};

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

    return (
        <Layout>
            <div>
                <div className="analyzed-responses-container">
                    {response && (
                        <div>
                            {getAdminComponentFromResponse(response)}
                            <AnalysisBox
                                type={response.type}
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
