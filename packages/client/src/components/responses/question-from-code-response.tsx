import * as monaco from "monaco-editor";
import { useContext, useEffect, useRef, useState } from "react";

import { AuthContext } from "../../context";
import { highlightCode } from "../../utils/utils";
import { ResponseFeedback } from "../response-feedback";

interface IProps {
    data: { code: string; question: string; answer: string; id: string };
}

export const QuestionFromCodeResponse = (props: IProps) => {
    const { context } = useContext(AuthContext);
    const codeEl = useRef(null);

    useEffect(() => {
        if (codeEl.current) {
            monaco.editor.colorizeElement(codeEl.current as HTMLElement, {
                theme: "vs",
                mimeType: "c",
                tabSize: 4,
            });
        }
    }, [codeEl]);

    return (
        <div>
            <div>{props.data.question}</div>
            <div ref={codeEl}>{props.data.code}</div>
            <div
                dangerouslySetInnerHTML={{
                    __html: highlightCode(props.data.answer),
                }}
            ></div>

            <ResponseFeedback responseId={props.data.id} />
        </div>
    );
};
