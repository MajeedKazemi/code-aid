import * as monaco from "monaco-editor";
import { Fragment, useContext, useEffect, useRef, useState } from "react";

import { AuthContext } from "../../context";
import { getIconSVG } from "../../utils/icons";
import { ResponseFeedback } from "../response-feedback";
import { responseToArrayWithKeywords } from "./keyword";

interface IProps {
    canUseToolbox: boolean;
    onSubmitFeedback: () => void;
    generateExample: (keyword: string) => void;
    askQuestion: (question: string) => void;
    data: {
        id: string;
        keyword: string;
        code: string;
        description: string;
        feedback?: {
            reason: string;
            rating: number;
        };
    };
}

export const KeywordExampleResponse = (props: IProps) => {
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
            <div className="main-question">
                <Fragment>
                    {getIconSVG("command-line", "response-header-icon")}
                    {"example usage of: "}
                    <span className="header-inline-code">
                        {props.data.keyword}
                    </span>
                </Fragment>
            </div>
            <div className="question-code" ref={codeEl}>
                {props.data.code}
            </div>
            <div className="main-answer">
                <div>
                    {responseToArrayWithKeywords(
                        props.data.description,
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
                    priorData={props.data.feedback}
                    responseId={props.data.id}
                    onSubmitFeedback={props.onSubmitFeedback}
                />
            </div>
        </div>
    );
};
