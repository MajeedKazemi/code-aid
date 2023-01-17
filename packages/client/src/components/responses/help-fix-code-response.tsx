import * as monaco from "monaco-editor";
import { Fragment, useContext, useEffect, useRef, useState } from "react";

import { getIconSVG } from "../../utils/icons";
import { highlightCode } from "../../utils/utils";
import { ResponseFeedback } from "../response-feedback";

interface IProps {
    canUseToolbox: boolean;
    onSubmitFeedback: () => void;
    generateExample: (keyword: string) => void;
    askQuestion: (question: string) => void;
    data: {
        code: string;
        intention: string;
        fixes: string[];
        id: string;
        feedback?: {
            reason: string;
            rating: number;
        };
    };
}

export const HelpFixCodeResponse = (props: IProps) => {
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
        <div className="explain-code-container">
            <div className="explain-code-header">
                <Fragment>
                    {getIconSVG("wrench", "response-header-icon")}
                    {" help fix code"}
                </Fragment>
            </div>
            <div className="explain-code-content">Your code:</div>
            <div className="question-code" ref={codeEl}>
                {props.data.code}
            </div>

            <div className="code-intention">
                <b>Intended behavior: </b>
                {props.data.intention}
            </div>

            <div className="short-explanation-text">
                <ul className="all-fixes-list">
                    {props.data.fixes.map((fix, index) => {
                        return (
                            <li
                                key={"fix-" + index}
                                dangerouslySetInnerHTML={{
                                    __html: highlightCode(
                                        fix,
                                        "fix-inline-code"
                                    ),
                                }}
                            ></li>
                        );
                    })}
                </ul>
            </div>

            <div className="content-margin">
                <ResponseFeedback
                    priorData={props.data.feedback}
                    responseId={props.data.id}
                    onSubmitFeedback={props.onSubmitFeedback}
                />
            </div>
        </div>
    );
};
