import * as monaco from "monaco-editor";
import { Fragment, useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { AuthContext, SocketContext } from "../../context";
import { getIconSVG } from "../../utils/icons";
import { highlightCode } from "../../utils/utils";
import { ResponseFeedback } from "../response-feedback";
import { HoverableFixedCode } from "../responses/hoverable-fixed-code";

interface IFixedCodeResponse {
    lines?: Array<{
        code: string;
        explanation: string;
    }>;
    explanation?: string;
    fixedCodeLinesCount?: number;
}

interface IProps {
    admin?: boolean;
    setCanUseToolbox?: (canUseToolbox: boolean) => void;
    canUseToolbox?: boolean;
    onSubmitFeedback?: () => void;
    generateExample?: (keyword: string) => void;
    askQuestion?: (question: string) => void;
    stream?: boolean;
    setStreamFinished?: (finished: boolean) => void;
    data: {
        id: string;
        time: Date;
        code: string;
        question: string;
        finished: boolean;

        response: IFixedCodeResponse;

        feedback?: {
            reason: string;
            rating: number;
        };
    };
}

export const FixCodeResponse = (props: IProps) => {
    const { context } = useContext(AuthContext);
    const { socket } = useContext(SocketContext);

    const codeEl = useRef(null);

    const [meta, setMeta] = useState({
        id: props.data.id,
        code: props.data.code,
        question: props.data.question,
        feedback: props.data.feedback,
        finished: props.data.finished,
        time: props.data.time,
    });

    const [streamFinished, setStreamFinished] = useState(
        props.stream ? false : meta.finished
    );

    const [response, setResponse] = useState<IFixedCodeResponse>({
        explanation: props.data.response?.explanation,
        lines: props.data.response?.lines,
        fixedCodeLinesCount: props.data.response?.fixedCodeLinesCount,
    });

    useEffect(() => {
        if (codeEl.current) {
            monaco.editor.colorizeElement(codeEl.current as HTMLElement, {
                theme: "dark",
                mimeType: "c",
                tabSize: 4,
            });
        }
    }, [codeEl]);

    if (props.stream && socket) {
        useEffect(() => {
            socket.emit("codex", {
                data: {
                    code: meta.code,
                    question: meta.question,
                },
                type: "fix-code",
                id: meta.id,
                from: socket.id,
                userId: context?.user?.id,
            });

            socket.on("codex", (d: any) => {
                if (d.componentId === props.data.id) {
                    if (d.type === "response") {
                        setResponse({
                            explanation: d.data.explanation,
                            lines: d.data.lines,
                            fixedCodeLinesCount: d.data.fixedCodeLinesCount,
                        });
                    } else if (d.type === "done") {
                        setStreamFinished(true);

                        if (props.setStreamFinished) {
                            props.setStreamFinished(true);
                        }
                    }
                }
            });
        }, [socket]);
    }

    return (
        <div className="response-main-container">
            {props.admin && (
                <Link
                    target="_blank"
                    className="admin-response-link"
                    to={`/response/${meta.id}`}
                >
                    Link: {meta.id}
                </Link>
            )}

            <div className="response-header">
                <Fragment>
                    {getIconSVG("wrench", "response-header-icon")}
                    <b>Help Fix Code:</b>
                </Fragment>
            </div>

            <div className="response-main-content">
                <div>
                    <div className="meta-question">
                        <span>
                            <b>Intended Behavior:</b> {meta.question}
                        </span>
                    </div>

                    <div className="response-main-answer">
                        {response.explanation && (
                            <span>
                                <b>Fixes:</b>{" "}
                                <span
                                    dangerouslySetInnerHTML={{
                                        __html: highlightCode(
                                            response.explanation,
                                            "inline-code-subtle"
                                        ),
                                    }}
                                ></span>
                            </span>
                        )}

                        {response.fixedCodeLinesCount &&
                            response.fixedCodeLinesCount > 0 &&
                            !response.lines && (
                                <span>
                                    generating {response.fixedCodeLinesCount}{" "}
                                    lines of code
                                </span>
                            )}
                    </div>

                    {response.lines && (
                        <div className="hoverable-code-container">
                            <div className="hoverable-code-header">
                                {getIconSVG(
                                    "cursor-arrow-rays",
                                    "response-header-icon"
                                )}
                                <b>
                                    Hover over red lines to see how to fix them
                                </b>
                            </div>

                            <div className="hoverable-code-content">
                                {response.lines?.map((line, index) => {
                                    return (
                                        <HoverableFixedCode
                                            code={line.code}
                                            explanation={line.explanation}
                                            key={
                                                JSON.stringify(line) +
                                                index.toString()
                                            }
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {streamFinished && (
                    <ResponseFeedback
                        admin={props.admin}
                        priorData={meta.feedback}
                        responseId={meta.id}
                        onSubmitFeedback={props.onSubmitFeedback}
                    />
                )}
            </div>
        </div>
    );
};
