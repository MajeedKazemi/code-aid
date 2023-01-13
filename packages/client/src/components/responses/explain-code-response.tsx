import * as monaco from "monaco-editor";
import { Fragment, useContext, useEffect, useRef, useState } from "react";

import { AuthContext } from "../../context";
import { getIconSVG } from "../../utils/icons";
import { responseToArrayWithKeywords } from "./keyword";

interface IProps {
    data: { code: string; steps: string[]; explanation: string; id: string };
}

export const ExplainCodeResponse = (props: IProps) => {
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
        <div className="explain-code-container">
            <div className="explain-code-header">
                <Fragment>
                    {getIconSVG("magnifying-glass", "response-header-icon")}
                    {" explain code"}
                </Fragment>
            </div>
            <div className="explained-code" ref={codeEl}>
                {props.data.code}
            </div>
            <div className="short-explanation-text">
                <Fragment>
                    {responseToArrayWithKeywords(props.data.explanation).map(
                        (item: string | JSX.Element, index: number) => {
                            if (typeof item === "string") {
                                return <span key={"txt-" + index}>{item}</span>;
                            }

                            return item;
                        }
                    )}
                </Fragment>
            </div>
            <div className="short-explanation-text">
                <ol>
                    {props.data.steps.map((s: string, i: number) => (
                        <li className="explain-code-response-step" key={i}>
                            <Fragment>
                                {responseToArrayWithKeywords(s).map(
                                    (
                                        item: string | JSX.Element,
                                        index: number
                                    ) => {
                                        if (typeof item === "string") {
                                            return (
                                                <span key={"txt-" + index}>
                                                    {item}
                                                </span>
                                            );
                                        }

                                        return item;
                                    }
                                )}
                            </Fragment>
                        </li>
                    ))}
                </ol>
            </div>

            {/* <ResponseFeedback responseId={props.data.id} /> */}
        </div>
    );
};
