import * as monaco from "monaco-editor";
import React, { useContext, useEffect, useRef, useState } from "react";

import {
    apiBreakDownTask,
    apiCheckCanUseToolbox,
    apiExplainCodeHover,
    apiHelpFixCode,
    apiInitResponse,
    apiKeywordUsageExample,
    apiRecentResponses,
} from "../api/api";
import { AuthContext, SocketContext } from "../context";
import { AskFromCodeResponse } from "./responses-socket/ask-from-code";
import { AskQuestionResponse } from "./responses-socket/ask-question";
import { BreakDownStepsResponse } from "./responses/break-down-task-response";
import { ExplainCodeHoverResponse } from "./responses/explain-code-hover-response";
import { ExplainCodeResponse } from "./responses/explain-code-response";
import { HelpFixCodeResponse } from "./responses/help-fix-code-response";
import { KeywordExampleResponse } from "./responses/keyword-example-response";
import { QuestionAnswerResponse } from "./responses/question-answer-response";
import { QuestionFromCodeResponse } from "./responses/question-from-code-response";
import { SelectableOption } from "./selectable-option";
import { DisclaimerComponent } from "./utils/disclaimer";
import { VideoContainer } from "./utils/video-container";

const disclaimerNotShowDays = 3;

export enum HintOption {
    AskQuestion = "ask question",
    QuestionFromCode = "ask question from code",
    ExplainCode = "explain code",
    BreakDownSteps = "task steps",
    HelpFix = "fix code",
}

export enum StatusMessage {
    OK = "",
    Loading = "Generating response...",
}

export const CodingAssistant = () => {
    const { context } = useContext(AuthContext);
    const { socket } = useContext(SocketContext);

    const editorEl = useRef<HTMLDivElement>(null);

    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [status, setStatus] = useState<StatusMessage>(StatusMessage.OK);
    const [buttonText, setButtonText] = useState<string>("ask");
    const [question, setQuestion] = useState<string>("");
    const [code, setCode] = useState<string>("");
    const [questionHeader, setQuestionHeader] = useState<string>("Question:");
    const [questionPlaceholder, setQuestionPlaceholder] = useState<string>(
        "type your question here..."
    );
    const [codeHeader, setCodeHeader] = useState<string>("Code:");
    const [showPrompt, setShowPrompt] = useState<boolean>(false);
    const [showEditor, setShowEditor] = useState<boolean>(false);
    const [responses, setResponses] = useState<any[]>([]);
    const [canUseToolbox, setCanUseToolbox] = useState<boolean>(false);
    const [editor, setEditor] =
        useState<monaco.editor.IStandaloneCodeEditor | null>(null);
    const [selectedOption, setSelectedOption] = useState<HintOption | null>(
        null
    );

    const displayError = (message: string) => {
        setErrorMessage(message);

        setTimeout(() => {
            setErrorMessage(null);
        }, 5000);
    };

    useEffect(() => {
        // check last time disclaimer was accepted
        let showDisclaimer = true;

        try {
            const lastTimeAcceptedDisclaimer = localStorage.getItem(
                "disclaimer-accepted-timestamp"
            );

            if (
                lastTimeAcceptedDisclaimer &&
                parseInt(lastTimeAcceptedDisclaimer) >
                    Date.now() - disclaimerNotShowDays * 24 * 60 * 60 * 1000
            ) {
                showDisclaimer = false;
            }
        } catch (e) {}

        // load latest responses on first load
        apiRecentResponses(context?.token).then(async (res) => {
            const data = await res.json();

            if (data.success) {
                if (!showDisclaimer) {
                    setResponses(
                        data.responses.map((it: any) => {
                            return {
                                ...it.data,
                                type: it.type,
                                id: it.id,
                                followUps: it.followUps,
                                feedback: it.feedback,
                                finished: it.finished,
                                time: it.time,
                            };
                        })
                    );
                } else {
                    setResponses([
                        {
                            type: "disclaimer",
                        },
                        ...data.responses.map((it: any) => {
                            return {
                                ...it.data,
                                type: it.type,
                                id: it.id,
                                followUps: it.followUps,
                                feedback: it.feedback,
                                finished: it.finished,
                                time: it.time,
                            };
                        }),
                    ]);
                }
            }
        });

        apiCheckCanUseToolbox(context?.token).then(async (res) => {
            const data = await res.json();

            if (data.success) {
                setCanUseToolbox(data.canUseToolbox);
            }
        });
    }, []);

    useEffect(() => {
        if (editorEl && !editor) {
            const monacoEditor = monaco.editor.create(editorEl.current!, {
                value: code,
                language: "c",
                theme: "dark",
                automaticLayout: true,
                fontSize: 18,
                lineHeight: 30,
            });

            monacoEditor.onDidChangeModelContent((e) => {
                setCode(monacoEditor.getValue());
            });

            setEditor(monacoEditor);
        }

        return () => editor?.dispose();
    }, [editorEl.current]);

    useEffect(() => {
        switch (selectedOption) {
            case HintOption.AskQuestion:
                setQuestionHeader("General question:");
                setQuestionPlaceholder("type your question here...");
                setCodeHeader(" ‌ ");
                setButtonText("ask");
                setShowPrompt(true);
                setShowEditor(false);
                editor?.updateOptions({ readOnly: true });

                break;

            case HintOption.QuestionFromCode:
                setQuestionHeader("Question from code:");
                setQuestionPlaceholder("type your question here...");
                setCodeHeader("Code to ask about:");
                setButtonText("ask");
                setShowPrompt(true);
                setShowEditor(true);

                editor?.updateOptions({ readOnly: false });
                break;

            case HintOption.ExplainCode:
                setQuestionHeader(" ‌ ");
                setQuestionPlaceholder(" ‌ ");
                setCodeHeader("Code to explain:");
                setButtonText("explain");
                setShowPrompt(false);
                setShowEditor(true);
                editor?.updateOptions({ readOnly: false });
                break;

            case HintOption.BreakDownSteps:
                setQuestionHeader("Task description");
                setQuestionPlaceholder(
                    "enter task description to break down..."
                );
                setCodeHeader(" ‌ ");
                setButtonText("assist");

                setShowPrompt(true);
                setShowEditor(false);
                editor?.updateOptions({ readOnly: true });
                break;

            case HintOption.HelpFix:
                setQuestionHeader("Intended behavior:");
                setQuestionPlaceholder("enter intended behavior of code...");
                setCodeHeader("Code to fix:");
                setButtonText("fix");

                setShowPrompt(true);
                setShowEditor(true);

                editor?.updateOptions({ readOnly: false });
                break;
        }
    }, [selectedOption]);

    const performQuery = async () => {
        if (!selectedOption) {
            displayError("Please select an option");

            return;
        }

        if (!canUseToolbox) {
            displayError("Please rate the last response before asking again");

            return;
        }

        switch (selectedOption) {
            case HintOption.AskQuestion:
                if (!question) {
                    // setStatus(StatusMessage.QuestionEmpty);
                    displayError("Please enter a question to ask.");

                    return;
                }

                if (question.length < 10) {
                    displayError("Please specify your question more clearly.");

                    return;
                }

                apiInitResponse(context?.token, "ask-question-v2")
                    .then(async (res) => {
                        const data = await res.json();

                        if (data.success) {
                            setResponses([
                                {
                                    question,
                                    type: "ask-question-v2",
                                    id: data.id,
                                    stream: true,
                                },
                                ...responses,
                            ]);

                            setStatus(StatusMessage.Loading);
                            setButtonText("loading");
                        } else {
                            displayError(
                                "Failed to generate example. Please try again or reload the page."
                            );
                            setButtonText("ask");
                        }
                    })
                    .catch((e) => {
                        displayError(
                            "Failed to generate example. Please try again or reload the page."
                        );
                        setButtonText("ask");
                    });

                break;

            case HintOption.BreakDownSteps:
                if (!question) {
                    displayError("Please explain the functionality you want.");

                    return;
                }

                if (question.length < 10) {
                    displayError(
                        "Please specify the functionality more clearly."
                    );

                    return;
                }

                setStatus(StatusMessage.Loading);
                setButtonText("loading");

                apiBreakDownTask(context?.token, question)
                    .then(async (res) => {
                        const data = await res.json();

                        setResponses([
                            { ...data, type: "break-down-steps" },
                            ...responses,
                        ]);
                        setStatus(StatusMessage.OK);
                        setCanUseToolbox(false);
                        setSelectedOption(null);
                        setQuestion("");
                        setButtonText("assist");
                    })
                    .catch(() => {
                        displayError(
                            "Failed to generate example. Please try again or reload the page."
                        );
                        setButtonText("assist");
                    });

                break;

            case HintOption.ExplainCode:
                if (!code) {
                    displayError("Please enter some code to explain.");

                    return;
                }

                setStatus(StatusMessage.Loading);
                setButtonText("loading");

                apiExplainCodeHover(context?.token, code)
                    .then(async (res) => {
                        const data = await res.json();

                        setResponses([
                            { ...data, type: "explain-code-hover" },
                            ...responses,
                        ]);
                        setStatus(StatusMessage.OK);
                        setCanUseToolbox(false);
                        setSelectedOption(null);
                        setQuestion("");
                        setButtonText("ask");
                    })
                    .catch(() => {
                        displayError(
                            "Failed to generate example. Please try again or reload the page."
                        );
                        setButtonText("ask");
                    });

                break;

            case HintOption.QuestionFromCode:
                if (!question && !code) {
                    displayError(
                        "Please enter a code and a question from the code."
                    );

                    return;
                } else if (!question) {
                    displayError("Please enter a question from the code.");

                    return;
                } else if (!code) {
                    displayError("Please enter a code to ask a question from.");

                    return;
                }

                apiInitResponse(context?.token, "question-from-code-v2")
                    .then(async (res) => {
                        const data = await res.json();

                        if (data.success) {
                            setResponses([
                                {
                                    code,
                                    question,
                                    type: "question-from-code-v2",
                                    id: data.id,
                                    stream: true,
                                },
                                ...responses,
                            ]);

                            setStatus(StatusMessage.Loading);
                            setButtonText("loading");
                        } else {
                            displayError(
                                "Failed to generate example. Please try again or reload the page."
                            );
                        }
                    })
                    .catch((e) => {
                        displayError(
                            "Failed to generate example. Please try again or reload the page."
                        );
                        setButtonText("ask");
                    });

                break;

            case HintOption.HelpFix:
                if (!question && !code) {
                    displayError(
                        "Please enter a code and its intended behaviour so that I could help you fix it."
                    );

                    return;
                } else if (!question) {
                    displayError(
                        "Please enter the intended behaviour of the code."
                    );

                    return;
                } else if (!code) {
                    displayError("Please enter the code to fix.");

                    return;
                }

                setStatus(StatusMessage.Loading);
                setButtonText("loading");

                apiHelpFixCode(context?.token, code, question)
                    .then(async (res) => {
                        const data = await res.json();

                        setResponses([
                            { ...data, type: "help-fix-code" },
                            ...responses,
                        ]);
                        setStatus(StatusMessage.OK);
                        setCanUseToolbox(false);
                        setSelectedOption(null);
                        setQuestion("");
                        setButtonText("assist");
                    })
                    .catch(() => {
                        displayError(
                            "Failed to generate example. Please try again or reload the page."
                        );
                        setButtonText("assist");
                    });

                break;

            default:
                break;
        }
    };

    const checkCanUseToolbox = () => {
        apiCheckCanUseToolbox(context?.token).then(async (res) => {
            const data = await res.json();

            if (data.success) {
                setCanUseToolbox(data.canUseToolbox);
            }
        });
    };

    const askQuestion = (question: string) => {
        setQuestion(question);
        setSelectedOption(HintOption.AskQuestion);

        window.scrollTo(0, 0);
    };

    const generateExample = (keyword: string) => {
        window.scrollTo(0, 0);
        setStatus(StatusMessage.Loading);

        apiKeywordUsageExample(context?.token, keyword)
            .then(async (res) => {
                const data = await res.json();

                if (data.success) {
                    setResponses([
                        { ...data, type: "keyword-example" },
                        ...responses,
                    ]);
                    setStatus(StatusMessage.OK);
                }
            })
            .catch(() => {
                displayError(
                    "Failed to generate example. Please try again or reload the page."
                );
            });
    };

    return (
        <main className="home-container">
            <div className="ai-assistant">
                <VideoContainer />
                <div className="assistant-toolbox-container">
                    <div className="toolbox-container">
                        <div className="main-editor-container">
                            <div className="main-editor-header">
                                {codeHeader}
                            </div>
                            <div className="main-editor" ref={editorEl}></div>
                            <div
                                className={
                                    showEditor
                                        ? "dummy-editor-enabled"
                                        : "dummy-editor-disabled"
                                }
                            ></div>
                        </div>

                        <div className="toolbox-right-container">
                            <div className="main-question-container">
                                <div className="main-question-header">
                                    {questionHeader}
                                </div>
                                <textarea
                                    className="main-question-input"
                                    onChange={(e) => {
                                        setQuestion(e.target.value);
                                    }}
                                    value={question}
                                    placeholder={questionPlaceholder}
                                ></textarea>
                                <div
                                    className={
                                        showPrompt
                                            ? "dummy-question-enabled"
                                            : "dummy-question-disabled"
                                    }
                                ></div>
                            </div>

                            <div className="selectable-options-container">
                                <SelectableOption
                                    icon="question"
                                    option={HintOption.AskQuestion}
                                    example="how can I generate a 2D array using malloc?"
                                    selected={
                                        selectedOption == HintOption.AskQuestion
                                    }
                                    onClick={() =>
                                        setSelectedOption(
                                            HintOption.AskQuestion
                                        )
                                    }
                                />
                                <SelectableOption
                                    icon="question"
                                    option={HintOption.QuestionFromCode}
                                    example="am I using pointers correctly?"
                                    selected={
                                        selectedOption ==
                                        HintOption.QuestionFromCode
                                    }
                                    onClick={() =>
                                        setSelectedOption(
                                            HintOption.QuestionFromCode
                                        )
                                    }
                                    codeIcon
                                />
                                <SelectableOption
                                    icon="magnifying-glass"
                                    option={HintOption.ExplainCode}
                                    selected={
                                        selectedOption == HintOption.ExplainCode
                                    }
                                    onClick={() =>
                                        setSelectedOption(
                                            HintOption.ExplainCode
                                        )
                                    }
                                    codeIcon
                                />
                                <SelectableOption
                                    icon="wrench"
                                    option={HintOption.HelpFix}
                                    selected={
                                        selectedOption == HintOption.HelpFix
                                    }
                                    onClick={() =>
                                        setSelectedOption(HintOption.HelpFix)
                                    }
                                    codeIcon
                                />
                                <SelectableOption
                                    icon="bullet"
                                    option={HintOption.BreakDownSteps}
                                    example="how can I write binary numbers to a file?"
                                    selected={
                                        selectedOption ==
                                        HintOption.BreakDownSteps
                                    }
                                    onClick={() =>
                                        setSelectedOption(
                                            HintOption.BreakDownSteps
                                        )
                                    }
                                />
                            </div>
                            <button
                                // disabled={canUseToolbox ? false : true}
                                className={
                                    "button-primary-full-width" +
                                    (canUseToolbox
                                        ? " button-primary-enabled"
                                        : " button-primary-disabled")
                                }
                                onClick={performQuery}
                            >
                                {buttonText}
                            </button>
                        </div>
                    </div>
                    <div>
                        {status !== StatusMessage.OK ? (
                            <div className="status-message-container">
                                {status}
                            </div>
                        ) : null}
                    </div>

                    <div className="responses-container">
                        {responses.map((response) => {
                            switch (response.type) {
                                case "disclaimer":
                                    return (
                                        <DisclaimerComponent key="disclaimer-key" />
                                    );

                                case "ask-question-v2":
                                    return (
                                        <AskQuestionResponse
                                            stream={response.stream}
                                            setStreamFinished={() => {
                                                setStatus(StatusMessage.OK);
                                                // setCanUseToolbox(false);
                                                setSelectedOption(null);
                                                setQuestion("");
                                                setButtonText("ask");
                                            }}
                                            key={response.id}
                                            data={response}
                                            canUseToolbox={canUseToolbox}
                                            onSubmitFeedback={
                                                checkCanUseToolbox
                                            }
                                            generateExample={generateExample}
                                            askQuestion={askQuestion}
                                            setCanUseToolbox={setCanUseToolbox}
                                        />
                                    );

                                case "question-from-code-v2":
                                    return (
                                        <AskFromCodeResponse
                                            stream={response.stream}
                                            setStreamFinished={() => {
                                                setStatus(StatusMessage.OK);
                                                // setCanUseToolbox(false);
                                                setSelectedOption(null);
                                                setQuestion("");
                                                setButtonText("ask");
                                            }}
                                            key={response.id}
                                            data={response}
                                            canUseToolbox={canUseToolbox}
                                            onSubmitFeedback={
                                                checkCanUseToolbox
                                            }
                                            generateExample={generateExample}
                                            askQuestion={askQuestion}
                                            setCanUseToolbox={setCanUseToolbox}
                                        />
                                    );

                                case "question-answer":
                                    return (
                                        <QuestionAnswerResponse
                                            key={response.id}
                                            data={response}
                                            canUseToolbox={canUseToolbox}
                                            onSubmitFeedback={
                                                checkCanUseToolbox
                                            }
                                            generateExample={generateExample}
                                            askQuestion={askQuestion}
                                            setCanUseToolbox={setCanUseToolbox}
                                        />
                                    );

                                case "break-down-steps":
                                    return (
                                        <BreakDownStepsResponse
                                            key={response.id}
                                            data={response}
                                            canUseToolbox={canUseToolbox}
                                            onSubmitFeedback={
                                                checkCanUseToolbox
                                            }
                                            generateExample={generateExample}
                                            askQuestion={askQuestion}
                                        />
                                    );

                                case "help-fix-code":
                                    return (
                                        <HelpFixCodeResponse
                                            key={response.id}
                                            data={response}
                                            canUseToolbox={canUseToolbox}
                                            onSubmitFeedback={
                                                checkCanUseToolbox
                                            }
                                            generateExample={generateExample}
                                            askQuestion={askQuestion}
                                        />
                                    );

                                case "explain-code":
                                    return (
                                        <ExplainCodeResponse
                                            key={response.id}
                                            data={response}
                                            canUseToolbox={canUseToolbox}
                                            onSubmitFeedback={
                                                checkCanUseToolbox
                                            }
                                            generateExample={generateExample}
                                            askQuestion={askQuestion}
                                        />
                                    );

                                case "explain-code-hover":
                                    return (
                                        <ExplainCodeHoverResponse
                                            key={response.id}
                                            data={response}
                                            canUseToolbox={canUseToolbox}
                                            onSubmitFeedback={
                                                checkCanUseToolbox
                                            }
                                            generateExample={generateExample}
                                            askQuestion={askQuestion}
                                        />
                                    );

                                case "question-from-code":
                                    return (
                                        <QuestionFromCodeResponse
                                            key={response.id}
                                            data={response}
                                            canUseToolbox={canUseToolbox}
                                            onSubmitFeedback={
                                                checkCanUseToolbox
                                            }
                                            generateExample={generateExample}
                                            askQuestion={askQuestion}
                                        />
                                    );

                                case "keyword-example":
                                    return (
                                        <KeywordExampleResponse
                                            key={response.id}
                                            data={response}
                                            canUseToolbox={canUseToolbox}
                                            onSubmitFeedback={
                                                checkCanUseToolbox
                                            }
                                            generateExample={generateExample}
                                            askQuestion={askQuestion}
                                        />
                                    );

                                default:
                                    return null;
                            }
                        })}
                    </div>
                </div>
            </div>

            {/* <div className="home-column">
                <Documentation />
            </div> */}

            {errorMessage && (
                <div className="error-container">
                    <div className="error-message">{errorMessage}</div>
                </div>
            )}
        </main>
    );
};
