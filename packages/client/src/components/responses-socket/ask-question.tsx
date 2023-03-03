import * as monaco from "monaco-editor";
import { Fragment, useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { apiInitFollowUp } from "../../api/api";
import { AuthContext, SocketContext } from "../../context";
import { getIconSVG } from "../../utils/icons";
import { StatusMessage } from "../coding-assistant";
import { ResponseFeedback } from "../response-feedback";
import { responseToArrayWithKeywords } from "../responses/keyword";
import { PseudoCodeHoverable } from "./pseudo-code-hoverable";

interface IAskQuestionResponse {
    answer?: string;
    cLibraryFunctions?: Array<{
        name: string;
        description: string;
        include: string;
        proto: string;
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
        question: string;
        finished: boolean;

        response: IAskQuestionResponse;

        feedback?: {
            reason: string;
            rating: number;
        };

        followUps: Array<any>;
    };
}

export const AskQuestionResponse = (props: IProps) => {
    const { context } = useContext(AuthContext);
    const { socket } = useContext(SocketContext);

    const [buttonText, setButtonText] = useState<string>("ask");
    const [status, setStatus] = useState<StatusMessage>(StatusMessage.OK);
    const [followUpQuestion, setFollowUpQuestion] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const codeEl = useRef(null);

    const [meta, setMeta] = useState({
        id: props.data.id,
        question: props.data.question,
        feedback: props.data.feedback,
        finished: props.data.finished,
        time: props.data.time,
    });

    const [response, setResponse] = useState<IAskQuestionResponse>({
        answer: props.data.response?.answer,
        cLibraryFunctions: props.data.response?.cLibraryFunctions,
        codeParts: props.data.response?.codeParts,
        suggestions: props.data.response?.suggestions,
        codeLinesCount: props.data.response?.codeLinesCount,
    });

    const [followUps, setFollowUps] = useState(
        props.data.followUps ? props.data.followUps : []
    );

    const displayError = (message: string) => {
        setErrorMessage(message);

        setTimeout(() => {
            setErrorMessage(null);
        }, 5000);
    };

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
                    question: props.data.question,
                },
                type: "ask-question",
                id: props.data.id,
                from: socket.id,
                userId: context?.user?.id,
            });

            socket.on("codex", (d: any) => {
                if (d.componentId === props.data.id) {
                    if (d.type === "response") {
                        setResponse({
                            answer: d.data.answer,
                            cLibraryFunctions: d.data.cLibraryFunctions,
                            codeParts: d.data.codePart,
                            suggestions: d.data.suggestions,
                        });
                    } else if (d.type === "done") {
                        if (props.setStreamFinished) {
                            props.setStreamFinished(true);
                        }
                    }
                }
            });
        }, [socket]);
    }

    return (
        <div className="question-answer-main-container">
            {props.admin && (
                <Link
                    target="_blank"
                    className="admin-response-link"
                    to={`/response/${meta.id}`}
                >
                    Link: {meta.id}
                </Link>
            )}

            <div className="main-question">
                <Fragment>
                    {getIconSVG("question", "response-header-icon")}
                    Ask Question Response
                </Fragment>
            </div>

            <div className="question-answer-main-content">
                <AskQuestionContent
                    key={props.data.id}
                    data={{
                        ...meta,
                        response,
                    }}
                    stream={props.stream}
                    admin={props.admin}
                    setStreamFinished={() => {
                        setStatus(StatusMessage.OK);
                        setButtonText("ask");
                        if (props.setCanUseToolbox) {
                            // props.setCanUseToolbox(false);
                        }
                    }}
                />

                <div className="follow-up-responses">
                    {followUps.map((f) => {
                        return (
                            <AskQuestionContent
                                followUp
                                key={f.id}
                                data={f}
                                stream={f.stream}
                                admin={props.admin}
                                setStreamFinished={() => {
                                    setStatus(StatusMessage.OK);
                                    setButtonText("ask");
                                    if (props.setCanUseToolbox) {
                                        // props.setCanUseToolbox(false);
                                    }
                                }}
                            />
                        );
                    })}
                </div>

                <div className="follow-up-question-input-container">
                    <textarea
                        placeholder="follow up question..."
                        className="follow-up-question-input"
                        onChange={(e) => {
                            setFollowUpQuestion(e.target.value);
                        }}
                        value={followUpQuestion}
                    ></textarea>

                    <button
                        disabled={props.canUseToolbox ? false : true}
                        className={
                            "follow-up-question-button " +
                            (props.canUseToolbox
                                ? "follow-up-question-button-enabled"
                                : "follow-up-question-button-disabled")
                        }
                        onClick={() => {
                            if (followUpQuestion.length < 3) {
                                displayError(
                                    "Please specify your follow-up question more clearly."
                                );

                                return;
                            }

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
                    >
                        {buttonText}
                    </button>
                </div>

                {status !== StatusMessage.OK ? (
                    <div className="status-message-container">{status}</div>
                ) : null}

                {/* {status === StatusMessage.OK && (
                    <ResponseFeedback
                        admin={props.admin}
                        priorData={meta.feedback}
                        responseId={meta.id}
                        onSubmitFeedback={props.onSubmitFeedback}
                    />
                )} */}
            </div>

            {errorMessage && (
                <div className="error-container">
                    <div className="error-message">{errorMessage}</div>
                </div>
            )}
        </div>
    );
};

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
                type: "ask-question-reply",
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
        <div>
            <div>{meta.question}</div>

            {response.answer && (
                <div>
                    <Fragment>
                        {responseToArrayWithKeywords(
                            response.answer,
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

                            {codePart.lines && codePart.lines.length > 0 && (
                                <PseudoCodeHoverable code={codePart.lines} />
                            )}
                        </div>
                    );
                })}

            <div>
                {response.cLibraryFunctions &&
                    response.cLibraryFunctions.map((f) => {
                        return (
                            <div
                                className="question-answer-c-library-function"
                                key={JSON.stringify(f)}
                            >
                                <div className="question-answer-c-library-function-title">
                                    <span>{f?.name}</span>
                                    <br />
                                    <span>{f?.description}</span>
                                    <br />
                                    <span>{f?.include}</span>
                                    <br />
                                    <span>{f?.proto}</span>
                                </div>
                                <hr />
                            </div>
                        );
                    })}
            </div>

            <div>
                {response.suggestions &&
                    response.suggestions.map((s) => {
                        return (
                            <div
                                className="question-answer-suggestion"
                                key={JSON.stringify(s)}
                            >
                                {s}
                            </div>
                        );
                    })}
            </div>

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
    );
};
