import * as monaco from "monaco-editor";
import { Fragment, useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { AuthContext } from "../../context";
import { getIconSVG } from "../../utils/icons";
import { ResponseFeedback } from "../response-feedback";
import { responseToArrayWithKeywords } from "./keyword";

interface IProps {
    admin?: boolean;
    canUseToolbox?: boolean;
    onSubmitFeedback?: () => void;
    generateExample?: (keyword: string) => void;
    askQuestion?: (question: string) => void;
    data: {
        code: string;
        question: string;
        answer: string;
        id: string;
        feedback?: {
            reason: string;
            rating: number;
        };
    };
}

export const QuestionFromCodeResponse = (props: IProps) => {
    const { context } = useContext(AuthContext);
    const codeEl = useRef(null);

    useEffect(() => {
        if (codeEl.current) {
            monaco.editor.colorizeElement(codeEl.current as HTMLElement, {
                theme: "dark",
                mimeType: "c",
                tabSize: 4,
            });
        }
    }, [codeEl]);

    return (
        <div className="question-from-code-container">
            {props.admin && (
                <Link
                    target="_blank"
                    className="admin-response-link"
                    to={`/response/${props.data.id}`}
                >
                    Link: {props.data.id}
                </Link>
            )}
            <div className="main-question">
                <Fragment>
                    {getIconSVG("question", "response-header-icon")}
                    {props.data.question}
                </Fragment>
            </div>
            <div className="question-code" ref={codeEl}>
                {props.data.code}
            </div>
            <div className="main-answer">
                <div>
                    {responseToArrayWithKeywords(
                        props.data.answer,
                        props.canUseToolbox,
                        props.askQuestion,
                        props.generateExample
                    ).map((item: string | JSX.Element, index: number) => {
                        if (typeof item === "string") {
                            return <span key={"txt-" + index}>{item}</span>;
                        }

                        return item;
                    })}
                </div>
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
