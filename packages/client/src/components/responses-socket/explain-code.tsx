import { Fragment, useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { apiInitFollowUp } from "../../api/api";
import { AuthContext, SocketContext } from "../../context";
import { getIconSVG } from "../../utils/icons";
import { highlightCode } from "../../utils/utils";
import { StatusMessage } from "../coding-assistant";
import { ResponseFeedback } from "../response-feedback";
import { HoverableExplainCode } from "../responses/hoverable-explain-code";
import { FollowUp } from "./follow-up";
import { PseudoCodeHoverable } from "./pseudo-code-hoverable";
import { QuickDocumentation } from "./quick-documentation";

interface IExplainCodeResponse {
    explanation?: string;
    lines: Array<{
        code: string;
        explanation: string;
    }>;
    cLibraryFunctions?: Array<{
        name: string;
        data: any;
    }>;
    suggestions?: Array<string>;
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
        finished: boolean;

        response: IExplainCodeResponse;

        feedback?: {
            reason: string;
            rating: number;
        };

        followUps: Array<any>;
    };
}

export const ExplainCodeV2Response = (props: IProps) => {
    const { context } = useContext(AuthContext);
    const { socket } = useContext(SocketContext);

    const [buttonText, setButtonText] = useState<string>("ask");
    const [status, setStatus] = useState<StatusMessage>(StatusMessage.OK);

    const [meta, setMeta] = useState({
        id: props.data.id,
        code: props.data.code,
        feedback: props.data.feedback,
        finished: props.data.finished,
        time: props.data.time,
    });

    const [streamFinished, setStreamFinished] = useState(
        props.stream ? false : meta.finished
    );

    const [response, setResponse] = useState<IExplainCodeResponse>({
        explanation: props.data.response?.explanation,
        lines: props.data.response?.lines,
        cLibraryFunctions: props.data.response?.cLibraryFunctions,
        suggestions: props.data.response?.suggestions,
    });

    const [followUps, setFollowUps] = useState(
        props.data.followUps ? props.data.followUps : []
    );

    if (props.stream && socket) {
        useEffect(() => {
            socket.emit("codex", {
                data: {
                    code: meta.code,
                },
                type: "explain-code",
                id: meta.id,
                from: socket.id,
                userId: context?.user?.id,
            });

            socket.on("codex", (d: any) => {
                if (d.componentId === props.data.id) {
                    if (d.type === "response") {
                        setResponse({
                            explanation: d.data.explanation,
                            cLibraryFunctions: d.data.cLibraryFunctions,
                            lines: d.data.lines,
                            suggestions: d.data.suggestions,
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

    let suggestions = [];

    if (followUps.length > 0) {
        suggestions = followUps[followUps.length - 1].response?.suggestions;
    } else if (response.suggestions) {
        suggestions = response.suggestions;
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
                    {getIconSVG("magnifying-glass", "response-header-icon")}
                    <b>Explain Code:</b>
                </Fragment>
            </div>

            <div className="response-main-content">
                <div className="response-main-answer">
                    {response.explanation && (
                        <span>
                            <b>Explanation:</b>{" "}
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
                </div>

                {response.lines && (
                    <div className="hoverable-code-container">
                        <div className="hoverable-code-header">
                            {getIconSVG(
                                "cursor-arrow-rays",
                                "response-header-icon"
                            )}
                            <b>
                                Hover over each line to see detailed
                                explanation:{" "}
                            </b>
                        </div>

                        <div className="hoverable-code-content">
                            {response.lines?.map((line, index) => {
                                return (
                                    <HoverableExplainCode
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

                {streamFinished && (
                    <ResponseFeedback
                        admin={props.admin}
                        priorData={meta.feedback}
                        responseId={meta.id}
                        onSubmitFeedback={props.onSubmitFeedback}
                    />
                )}
            </div>

            {followUps?.length > 0 && (
                <div className="follow-ups-container">
                    {followUps.map((f) => {
                        return (
                            <AskQuestionContent
                                followUp
                                key={f.id}
                                data={{
                                    ...f,
                                    mainId: meta.id,
                                }}
                                stream={f.stream}
                                admin={props.admin}
                                canUseToolbox={props.canUseToolbox}
                                setCanUseToolbox={props.setCanUseToolbox}
                                onSubmitFeedback={props.onSubmitFeedback}
                                setFollowUpResponse={(response) => {
                                    const newFollowUps = followUps.map(
                                        (old) => {
                                            if (f.id === old.id) {
                                                return {
                                                    ...old,
                                                    response,
                                                };
                                            }

                                            return old;
                                        }
                                    );

                                    setFollowUps(newFollowUps);
                                }}
                                setStreamFinished={() => {
                                    setStatus(StatusMessage.OK);
                                    setButtonText("ask");
                                    if (props.setCanUseToolbox) {
                                        props.setCanUseToolbox(false);
                                    }
                                }}
                            />
                        );
                    })}
                </div>
            )}

            <FollowUp
                suggestions={suggestions}
                canUseToolbox={props.canUseToolbox}
                status={status}
                buttonText={buttonText}
                onFollowUp={(followUpQuestion: string) => {
                    apiInitFollowUp(
                        context?.token,
                        meta.id,
                        followUps.length
                    ).then(async (res) => {
                        const data = await res.json();

                        if (data.success) {
                            setFollowUps([
                                ...followUps,
                                {
                                    id: data.id,
                                    mainId: meta.id,
                                    stream: true,
                                    question: followUpQuestion,
                                    response: undefined,
                                    feedback: undefined,
                                },
                            ]);

                            setStatus(StatusMessage.Loading);
                            setButtonText("loading");
                        }
                    });
                }}
            />
        </div>
    );
};

interface IAskQuestionResponse {
    answer?: string;
    cLibraryFunctions?: Array<{
        name: string;
        data: any;
    }>;
    codeLinesCount?: number;
    codeParts?: Array<{
        title: string;
        lines: Array<{
            code: string;
            explanation: string;
        }>;
    }>;
    suggestions?: Array<string>;
}

interface IAskQuestionContentProps {
    admin?: boolean;
    data: {
        id: string;
        mainId?: string;

        time: Date;
        finished: boolean;

        question: string;
        response?: IAskQuestionResponse;

        feedback?: {
            reason: string;
            rating: number;
        };
    };

    canUseToolbox?: boolean;
    onSubmitFeedback?: () => void;
    setCanUseToolbox?: (canUseToolbox: boolean) => void;
    generateExample?: (keyword: string) => void;
    askQuestion?: (question: string) => void;
    followUp?: boolean;
    stream?: boolean;
    setStreamFinished?: (finished: boolean) => void;
    setFollowUpResponse?: (response: IAskQuestionResponse) => void;
}

const AskQuestionContent = (props: IAskQuestionContentProps) => {
    const { context } = useContext(AuthContext);
    const { socket } = useContext(SocketContext);

    const [meta, setMeta] = useState({
        id: props.data.id,
        mainId: props.data.mainId,
        question: props.data.question,
        feedback: props.data.feedback,
        time: props.data.time,
        finished: props.data.finished,
    });

    const [response, setResponse] = useState({
        answer: props.data.response?.answer,
        cLibraryFunctions: props.data.response?.cLibraryFunctions,
        codeParts: props.data.response?.codeParts,
        suggestions: props.data.response?.suggestions,
        codeLinesCount: props.data.response?.codeLinesCount,
    });

    const [streamFinished, setStreamFinished] = useState(
        props.stream ? false : meta.finished
    );

    if (props.stream && socket) {
        useEffect(() => {
            // begin streaming
            socket.emit("codex", {
                data: {
                    question: props.data.question,
                    mainId: props.data.mainId,
                },
                type: "explain-code-reply",
                id: props.data.id,
                from: socket.id,
                userId: context?.user?.id,
            });

            // listen for response
            socket.on("codex", (d: any) => {
                if (d.componentId === props.data.id) {
                    if (d.type === "response") {
                        setResponse({
                            answer: d.data.answer,
                            cLibraryFunctions: d.data.cLibraryFunctions,
                            codeParts: d.data.codeParts,
                            suggestions: d.data.suggestions,
                            codeLinesCount: d.data.codeLinesCount,
                        });

                        if (props.setFollowUpResponse) {
                            props.setFollowUpResponse({
                                answer: d.data.answer,
                                cLibraryFunctions: d.data.cLibraryFunctions,
                                codeParts: d.data.codeParts,
                                suggestions: d.data.suggestions,
                                codeLinesCount: d.data.codeLinesCount,
                            });
                        }
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
        <Fragment>
            {props.followUp && <div className="follow-up-separator" />}
            <div className="response-main-content">
                <div className="meta-question">
                    <span>
                        <b>Question:</b> {meta.question}
                    </span>
                </div>

                {response.answer && (
                    <div className="response-main-answer">
                        <b>Response:</b>{" "}
                        <span
                            dangerouslySetInnerHTML={{
                                __html: highlightCode(
                                    response.answer,
                                    "inline-code-subtle"
                                ),
                            }}
                        ></span>
                    </div>
                )}

                {response.codeLinesCount &&
                    response.codeLinesCount > 0 &&
                    !response.codeParts && (
                        <span>
                            generating {response.codeLinesCount} lines of code
                        </span>
                    )}

                {response.codeParts &&
                    response.codeParts.map((codePart) => {
                        return (
                            <div>
                                <div>{codePart.title}</div>

                                {codePart.lines &&
                                    codePart.lines.length > 0 && (
                                        <PseudoCodeHoverable
                                            code={codePart.lines}
                                        />
                                    )}
                            </div>
                        );
                    })}

                {response.cLibraryFunctions &&
                    response.cLibraryFunctions?.length > 0 && (
                        <div className="c-library-functions-container">
                            <span className="c-library-functions-title">
                                {"Standard Library Functions (Manual Pages): "}
                            </span>
                            {response.cLibraryFunctions?.map(
                                (cLibraryFunction) => (
                                    <QuickDocumentation
                                        key={cLibraryFunction.name}
                                        name={cLibraryFunction.name}
                                        data={cLibraryFunction.data}
                                    />
                                )
                            )}
                        </div>
                    )}

                {streamFinished && (
                    <ResponseFeedback
                        admin={props.admin}
                        priorData={meta.feedback}
                        responseId={meta.mainId ? meta.mainId : meta.id}
                        followUpId={props.followUp ? meta.id : undefined}
                        onSubmitFeedback={props.onSubmitFeedback}
                    />
                )}
            </div>
        </Fragment>
    );
};
