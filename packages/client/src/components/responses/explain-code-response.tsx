import * as monaco from "monaco-editor";
import { useContext, useEffect, useRef, useState } from "react";

import { AuthContext } from "../../context";
import { highlightCode } from "../../utils/utils";

interface IProps {
    data: { code: string; steps: string[]; explanation: string; id: string };
}

export const ExplainCodeResponse = (props: IProps) => {
    const { context } = useContext(AuthContext);
    const codeEl = useRef(null);

    useEffect(() => {
        if (codeEl.current) {
            monaco.editor.colorizeElement(codeEl.current as HTMLElement, {
                theme: "vs",
                mimeType: "python",
                tabSize: 4,
            });
        }
    }, [codeEl]);

    return (
        <div>
            <div ref={codeEl}>{props.data.code}</div>
            <div>{props.data.explanation}</div>
            <div>
                <ol>
                    {props.data.steps.map((s: string, i: number) => (
                        <li
                            key={i}
                            dangerouslySetInnerHTML={{
                                __html: highlightCode(s),
                            }}
                        ></li>
                    ))}
                </ol>
            </div>
        </div>
    );
};
