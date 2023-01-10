import * as monaco from "monaco-editor";
import { Fragment, useContext, useEffect, useRef, useState } from "react";

import { AuthContext } from "../../context";
import { getIconSVG } from "../../utils/icons";
import { highlightCode } from "../../utils/utils";

interface IProps {
    data: { code: string; question: string; answer: string; id: string };
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
            <div className="main-question">
                <Fragment>
                    {getIconSVG("question", "response-header-icon")}
                    {props.data.question}
                </Fragment>
            </div>
            <div className="question-code" ref={codeEl}>
                {props.data.code}
            </div>
            <div
                className="main-answer"
                dangerouslySetInnerHTML={{
                    __html: highlightCode(props.data.answer),
                }}
            ></div>

            {/* <ResponseFeedback responseId={props.data.id} /> */}
        </div>
    );
};
