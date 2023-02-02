import { Fragment, useContext, useEffect, useRef, useState } from "react";
import { v4 as uuid } from "uuid";

import { getIconSVG } from "../../utils/icons";
import { ResponseFeedback } from "../response-feedback";
import { HoverableExplainCode } from "./hoverable-explain-code";
import { responseToArrayWithKeywords } from "./keyword";

interface IProps {
    admin?: boolean;
    canUseToolbox?: boolean;
    onSubmitFeedback?: () => void;
    generateExample?: (keyword: string) => void;
    askQuestion?: (question: string) => void;
    data: {
        annotatedCode: Array<{
            code: string;
            explanation: string | null;
        }>;
        explanation: string;
        id: string;
        feedback?: {
            reason: string;
            rating: number;
        };
    };
}

export const ExplainCodeHoverResponse = (props: IProps) => {
    return (
        <div className="explain-code-container">
            <div className="explain-code-header">
                <Fragment>
                    {getIconSVG("magnifying-glass", "response-header-icon")}
                    {" explain code"}
                </Fragment>
            </div>
            <div className="explain-code-content">
                Hover over each line to see detailed explanation:
            </div>
            <div className="explained-code">
                {props.data.annotatedCode.map((line, index) => {
                    return (
                        <HoverableExplainCode
                            code={line.code}
                            explanation={line.explanation}
                            key={"hoverable-line-code-" + index + "-" + uuid()}
                        />
                    );
                })}
            </div>
            <div className="explain-code-content">Summary of the code:</div>
            <div className="short-explanation-text">
                <Fragment>
                    {responseToArrayWithKeywords(
                        props.data.explanation,
                        props.canUseToolbox,
                        props.askQuestion,
                        props.generateExample
                    ).map((item: string | JSX.Element, index: number) => {
                        if (typeof item === "string") {
                            return <span key={"txt-" + index}>{item}</span>;
                        }

                        return item;
                    })}
                </Fragment>
            </div>

            <div className="content-margin">
                <ResponseFeedback
                    admin={props.admin}
                    priorData={props.data.feedback}
                    responseId={props.data.id}
                    onSubmitFeedback={props.onSubmitFeedback}
                />
            </div>
        </div>
    );
};
