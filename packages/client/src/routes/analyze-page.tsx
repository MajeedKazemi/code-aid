import React, { useContext, useEffect, useState } from "react";

import { apiGetNewRandomResponseToAnalyze } from "../api/admin-api";
import { AnalysisBox } from "../components/analysis-box";
import { Layout } from "../components/layout";
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
    const [selectedRating, setSelectedRating] = useState<number | null>(null);
    const [selectedWithReason, setSelectedWithReason] =
        useState<boolean>(false);

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
            <div className="analyze-data-main-container">
                {/* show progress: how many responses are analyzed from each type of feature + percentages + total percentage */}

                <form
                    className="analyze-data-new-data-form"
                    onSubmit={(e) => {
                        e.preventDefault();

                        apiGetNewRandomResponseToAnalyze(
                            context?.token,
                            selectedType,
                            selectedRating,
                            selectedWithReason
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
                    }}
                >
                    <div>
                        <div>
                            <h4>feature type:</h4>
                            <label>
                                <input
                                    type="radio"
                                    value="any"
                                    checked={!selectedType}
                                    onChange={(e) => setSelectedType(null)}
                                />
                                any
                            </label>
                            <br />

                            <label>
                                <input
                                    type="radio"
                                    value="explain-code-hover"
                                    checked={
                                        selectedType === "explain-code-hover"
                                    }
                                    onChange={(e) =>
                                        setSelectedType(e.target.value)
                                    }
                                />
                                explain-code-hover
                            </label>
                            <br />

                            <label>
                                <input
                                    type="radio"
                                    value="question-answer"
                                    checked={selectedType === "question-answer"}
                                    onChange={(e) =>
                                        setSelectedType(e.target.value)
                                    }
                                />
                                question-answer
                            </label>
                            <br />

                            <label>
                                <input
                                    type="radio"
                                    value="break-down-steps"
                                    checked={
                                        selectedType === "break-down-steps"
                                    }
                                    onChange={(e) =>
                                        setSelectedType(e.target.value)
                                    }
                                />
                                break-down-steps
                            </label>
                            <br />

                            <label>
                                <input
                                    type="radio"
                                    value="help-fix-code"
                                    checked={selectedType === "help-fix-code"}
                                    onChange={(e) =>
                                        setSelectedType(e.target.value)
                                    }
                                />
                                help-fix-code
                            </label>
                            <br />

                            <label>
                                <input
                                    type="radio"
                                    value="question-from-code"
                                    checked={
                                        selectedType === "question-from-code"
                                    }
                                    onChange={(e) =>
                                        setSelectedType(e.target.value)
                                    }
                                />
                                question-from-code
                            </label>
                            <br />

                            <label>
                                <input
                                    type="radio"
                                    value="keyword-example"
                                    checked={selectedType === "keyword-example"}
                                    onChange={(e) =>
                                        setSelectedType(e.target.value)
                                    }
                                />
                                keyword-example
                            </label>
                        </div>
                        <hr />
                        <div>
                            <h4>rating:</h4>
                            <label>
                                <input
                                    type="radio"
                                    value={0}
                                    checked={!selectedRating}
                                    onChange={(e) => setSelectedRating(null)}
                                />
                                any
                            </label>
                            <br />

                            <label>
                                <input
                                    type="radio"
                                    value={1}
                                    checked={selectedRating == 1}
                                    onChange={(e) => setSelectedRating(1)}
                                />
                                1
                            </label>
                            <br />

                            <label>
                                <input
                                    type="radio"
                                    value={2}
                                    checked={selectedRating == 2}
                                    onChange={(e) => setSelectedRating(2)}
                                />
                                2
                            </label>
                            <br />

                            <label>
                                <input
                                    type="radio"
                                    value={3}
                                    checked={selectedRating == 3}
                                    onChange={(e) => setSelectedRating(3)}
                                />
                                3
                            </label>
                            <br />

                            <label>
                                <input
                                    type="radio"
                                    value={4}
                                    checked={selectedRating == 4}
                                    onChange={(e) => setSelectedRating(4)}
                                />
                                4
                            </label>
                            <br />

                            <label>
                                <input
                                    type="radio"
                                    value={5}
                                    checked={selectedRating == 5}
                                    onChange={(e) => setSelectedRating(5)}
                                />
                                5
                            </label>
                            <br />
                        </div>

                        <hr />

                        <div>
                            <h4>with reason:</h4>

                            <label>
                                <input
                                    type="radio"
                                    value={"false"}
                                    checked={!selectedWithReason}
                                    onChange={(e) =>
                                        setSelectedWithReason(false)
                                    }
                                />
                                without reason
                            </label>
                            <br />

                            <label>
                                <input
                                    type="radio"
                                    value={"true"}
                                    checked={selectedWithReason}
                                    onChange={(e) =>
                                        setSelectedWithReason(true)
                                    }
                                />
                                with reason
                            </label>
                            <br />
                        </div>
                    </div>

                    <br />

                    <button type="submit">get new response to analyze</button>
                </form>

                {analysisResponse && (
                    <div className="analyze-response-container">
                        {displayResponse(analysisResponse)}
                        <AnalysisBox
                            responseId={analysisResponse.id}
                        ></AnalysisBox>
                    </div>
                )}
            </div>
        </Layout>
    );
};
