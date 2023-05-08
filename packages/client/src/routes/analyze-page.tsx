import React, { useContext, useEffect, useState } from "react";

import { apiGetNewRandomResponseToAnalyze } from "../api/admin-api";
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

export const AnalyzePage = () => {
    const { context, setContext } = useContext(AuthContext);
    const [analysisResponse, setAnalysisResponse] = useState<any>(null);
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [selectedTimePeriod, setSelectedTimePeriod] = useState<string | null>(
        null
    );

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

    const getNewResponse = () => {
        apiGetNewRandomResponseToAnalyze(
            context?.token,
            selectedType,
            selectedTag,
            selectedTimePeriod
        )
            .then(async (res) => {
                if (res.status === 200) {
                    const data = await res.json();

                    if (data.response) {
                        setAnalysisResponse({
                            ...data.response.data,
                            type: data.response.type,
                            id: data.response._id,
                            followUps: data.response.followUps,
                            feedback: data.response.feedback,
                        });
                    }
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <Layout>
            <div className="analyze-data-main-container">
                {/* show progress: how many responses are analyzed from each type of feature + percentages + total percentage */}

                <form
                    className="analyze-data-new-data-form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        getNewResponse();
                    }}
                >
                    <div>
                        <h4>Feature Type:</h4>
                        {[
                            "explain-code-hover",
                            "explain-code-v2",
                            "help-fix-code",
                            "help-fix-code-v2",
                            "question-from-code",
                            "question-from-code-v2",
                            "question-answer",
                            "ask-question-v2",
                            "break-down-steps",
                            "write-code-v2",
                        ].map((type) => (
                            <div>
                                <label>
                                    <input
                                        type="radio"
                                        value={type}
                                        checked={selectedType === type}
                                        onChange={(e) =>
                                            setSelectedType(e.target.value)
                                        }
                                    />
                                    {type}
                                </label>
                                <br />
                            </div>
                        ))}

                        <div>
                            <h4>Topic:</h4>
                            {[
                                "lab1",
                                "lab2",
                                "lab3",
                                "lab4",
                                "lab5",
                                "lab6",
                                "lab7",
                                "lab8",
                                "lab9",
                                "lab10",
                                "lab11",
                                "a1",
                                "a2",
                                "a3",
                                "a4",
                                "other",
                            ].map((tag) => (
                                <div>
                                    <label>
                                        <input
                                            type="radio"
                                            value={tag}
                                            checked={selectedTag === tag}
                                            onChange={(e) =>
                                                setSelectedTag(e.target.value)
                                            }
                                        />
                                        {tag}
                                    </label>
                                    <br />
                                </div>
                            ))}
                        </div>
                    </div>

                    <br />

                    <div>
                        <div>
                            <h4>Pick Time Period:</h4>

                            {[
                                "week1-lab1",
                                "week2-lab2",
                                "week3-lab3",
                                "week4-lab4-a1",
                                "week5-lab5",
                                "week6-lab6-a2",
                                "week7-lab7",
                                "week8-lab8",
                                "week9-lab9-a3",
                                "week10-lab10",
                                "week11-lab11",
                                "week12-lab12-a4",
                                "final",
                            ].map((timePeriod) => (
                                <div>
                                    <label>
                                        <input
                                            type="radio"
                                            value={timePeriod}
                                            checked={
                                                selectedTimePeriod ===
                                                timePeriod
                                            }
                                            onChange={(e) =>
                                                setSelectedTimePeriod(
                                                    e.target.value
                                                )
                                            }
                                        />
                                        {timePeriod}
                                    </label>
                                    <br />
                                </div>
                            ))}
                        </div>

                        <br />
                    </div>

                    <button type="submit">Get new Response to Analyze</button>
                </form>

                {analysisResponse && (
                    <div className="analyze-response-container">
                        {displayResponse(analysisResponse)}
                        <AnalysisBox
                            analyzePage
                            onSubmit={() => {
                                getNewResponse();
                            }}
                            responseId={analysisResponse.id}
                            type={analysisResponse.type}
                        ></AnalysisBox>
                    </div>
                )}
            </div>
        </Layout>
    );
};
