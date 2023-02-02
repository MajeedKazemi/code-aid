import React, { useContext, useEffect, useState } from "react";

import { apiSetResponseAnalysis } from "../api/admin-api";
import { Button } from "../components/button";
import { LikertScale } from "../components/utils/likert";
import { AuthContext } from "../context";

interface IProps {
    responseId: string;
    priorAnalysis?: {
        likertScales: {
            relevance: number;
            correctness: number;
            helpfulness: number;
            directness: number;
        };
        notes: string;
        time: Date;
        admin: string;
    };
}

export const AnalysisBox = (props: IProps) => {
    const { context, setContext } = useContext(AuthContext);
    const [changed, setChanged] = useState<boolean>(
        props.priorAnalysis ? false : true
    );
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const displayError = (message: string) => {
        setErrorMessage(message);

        setTimeout(() => {
            setErrorMessage(null);
        }, 5000);
    };

    const [likertScaleRelevance, setLikertScaleRelevance] = useState<
        number | null
    >(props.priorAnalysis?.likertScales.relevance || null);
    const [likertScaleCorrectness, setLikertScaleCorrectness] = useState<
        number | null
    >(props.priorAnalysis?.likertScales.correctness || null);
    const [likertScaleHelpfulness, setLikertScaleHelpfulness] = useState<
        number | null
    >(props.priorAnalysis?.likertScales.helpfulness || null);
    const [likertScaleDirectness, setLikertScaleDirectness] = useState<
        number | null
    >(props.priorAnalysis?.likertScales.directness || null);

    const [analysisNotes, setAnalysisNotes] = useState<string>(
        props.priorAnalysis?.notes || ""
    );

    console.log(changed);

    return (
        <div className="analysis-box">
            {props.priorAnalysis && (
                <div>
                    <div>by: {props.priorAnalysis.admin}</div>
                    {/* <div>at: {props.priorAnalysis.time.toDateString()}</div> */}
                </div>
            )}

            <LikertScale
                priorRating={props.priorAnalysis?.likertScales.relevance}
                options={["0", "1", "2", "3", "4", "5", "6"]}
                question={"how related to C programming?"}
                onChange={(val: number) => {
                    setLikertScaleRelevance(val);
                    setChanged(true);
                }}
            />

            <LikertScale
                priorRating={props.priorAnalysis?.likertScales.correctness}
                options={["0", "1", "2", "3", "4", "5", "6"]}
                question={"how technically correct?"}
                onChange={(val: number) => {
                    setLikertScaleCorrectness(val);
                    setChanged(true);
                }}
            />

            <LikertScale
                priorRating={props.priorAnalysis?.likertScales.helpfulness}
                options={["0", "1", "2", "3", "4", "5", "6"]}
                question={"how helpful?"}
                onChange={(val: number) => {
                    setLikertScaleHelpfulness(val);
                    setChanged(true);
                }}
            />

            <LikertScale
                priorRating={props.priorAnalysis?.likertScales.directness}
                options={["0", "1", "2", "3", "4", "5", "6"]}
                question={"how revealing solution?"}
                onChange={(val: number) => {
                    setLikertScaleDirectness(val);
                    setChanged(true);
                }}
            />

            <textarea
                className="analysis-notes-textarea"
                onChange={(e) => {
                    setAnalysisNotes(e.target.value);
                    setChanged(true);
                }}
                value={analysisNotes}
                placeholder="any specific notes about this response?"
            ></textarea>

            <br />

            <Button
                onClick={() => {
                    if (!likertScaleCorrectness) {
                        displayError("please rate correctness");

                        return;
                    }

                    if (!likertScaleRelevance) {
                        displayError("please rate relevance");

                        return;
                    }

                    if (!likertScaleHelpfulness) {
                        displayError("please rate helpfulness");

                        return;
                    }

                    if (!likertScaleDirectness) {
                        displayError("please rate directness");

                        return;
                    }

                    apiSetResponseAnalysis(
                        context?.token,
                        props.responseId,
                        {
                            relevance: likertScaleRelevance,
                            correctness: likertScaleCorrectness,
                            helpfulness: likertScaleHelpfulness,
                            directness: likertScaleDirectness,
                        },
                        analysisNotes
                    ).then(async (res) => {
                        if (res.status === 200) {
                            setChanged(false);
                        }
                    });
                }}
            >
                {changed ? "submit analysis" : "analysis submitted"}
            </Button>

            {errorMessage && (
                <div className="error-container">
                    <div className="error-message">{errorMessage}</div>
                </div>
            )}
        </div>
    );
};
