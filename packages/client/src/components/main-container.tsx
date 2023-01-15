import * as monaco from "monaco-editor";
import React, { useContext, useEffect, useRef, useState } from "react";

import {
    apiAnswerQuestion,
    apiBreakDownTask,
    apiCheckCanUseToolbox,
    apiExplainCode,
    apiHelpFixCode,
    apiKeywordUsageExample,
    apiQuestionFromCode,
    apiRecentResponses,
} from "../api/api";
import { AuthContext } from "../context";
import { BreakDownStepsResponse } from "./responses/break-down-task-response";
import { ExplainCodeResponse } from "./responses/explain-code-response";
import { KeywordExampleResponse } from "./responses/keyword-example-response";
import { QuestionAnswerResponse } from "./responses/question-answer-response";
import { QuestionFromCodeResponse } from "./responses/question-from-code-response";
import { SelectableOption } from "./selectable-option";

export enum HintOption {
    AskQuestion = "ask question",
    QuestionFromCode = "ask question from code",
    ExplainCode = "explain code",
    BreakDownSteps = "task steps",
    HelpFix = "fix code",
}

export enum StatusMessage {
    OK = "",
    Loading = "loading",
    Failed = "server error, please retry, or refresh",
    QuestionEmpty = "question cannot be empty",
    CodeEmpty = "code cannot be empty",
    QuestionAndCodeEmpty = "please enter both code and question",
}

export const MainComponent = () => {
    const { context } = useContext(AuthContext);

    const editorEl = useRef<HTMLDivElement>(null);

    const [status, setStatus] = useState<StatusMessage>(StatusMessage.OK);
    const [buttonText, setButtonText] = useState<string>("ask");
    const [question, setQuestion] = useState<string>("");
    const [code, setCode] = useState<string>("");
    const [questionHeader, setQuestionHeader] = useState<string>("Question:");
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

    useEffect(() => {
        // load latest responses on first load
        apiRecentResponses(context?.token).then(async (res) => {
            const data = await res.json();

            if (data.success) {
                setResponses(
                    data.responses.map((it: any) => {
                        return {
                            ...it.data,
                            type: it.type,
                            id: it.id,
                            followUps: it.followUps,
                            feedback: it.feedback,
                        };
                    })
                );
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
            monaco.editor.defineTheme("dark", {
                base: "vs-dark",
                inherit: true,
                rules: [{ background: "001e3c", token: "" }],
                colors: {
                    "editor.background": "#001e3c",
                },
            });
            monaco.editor.setTheme("myTheme");

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
                setQuestionHeader("Question:");
                setCodeHeader("");
                setShowPrompt(true);
                setShowEditor(false);
                setButtonText("ask");
                editor?.updateOptions({ readOnly: true });

                break;

            case HintOption.ExplainCode:
                setQuestionHeader("");
                setCodeHeader("Code:");
                setShowPrompt(false);
                setShowEditor(true);
                setButtonText("ask");
                editor?.updateOptions({ readOnly: false });
                break;

            case HintOption.BreakDownSteps:
                setQuestionHeader("Question:");
                setCodeHeader("");
                setShowPrompt(true);
                setShowEditor(false);
                setButtonText("assist");
                editor?.updateOptions({ readOnly: true });
                break;

            // case HintOption.HelpFix:
            //     setQuestionHeader("");
            //     setCodeHeader("Code:");
            //     setShowPrompt(false);
            //     setShowEditor(true);
            //     setButtonText("assist");
            //     editor?.updateOptions({ readOnly: false });
            //     break;

            case HintOption.QuestionFromCode:
                setQuestionHeader("Question:");
                setCodeHeader("Code:");
                setShowPrompt(true);
                setShowEditor(true);
                setButtonText("ask");
                editor?.updateOptions({ readOnly: false });
                break;
        }
    }, [selectedOption]);

    const performQuery = () => {
        if (!selectedOption) return;

        switch (selectedOption) {
            case HintOption.AskQuestion:
                if (!question) {
                    setStatus(StatusMessage.QuestionEmpty);

                    return;
                }

                setStatus(StatusMessage.Loading);
                setButtonText("loading");

                apiAnswerQuestion(context?.token, question)
                    .then(async (res) => {
                        const data = await res.json();

                        setResponses([
                            { ...data, type: "question-answer" },
                            ...responses,
                        ]);
                        setStatus(StatusMessage.OK);
                        setCanUseToolbox(false);
                        setSelectedOption(null);
                        setQuestion("");
                        setCode("");
                    })
                    .catch(() => {
                        setStatus(StatusMessage.Failed);
                        setButtonText("ask");
                    });

                break;

            case HintOption.BreakDownSteps:
                if (!question) {
                    setStatus(StatusMessage.QuestionEmpty);

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
                        setCode("");
                    })
                    .catch(() => {
                        setStatus(StatusMessage.Failed);
                        setButtonText("assist");
                    });

                break;

            case HintOption.ExplainCode:
                if (!code) {
                    setStatus(StatusMessage.CodeEmpty);

                    return;
                }

                setStatus(StatusMessage.Loading);
                setButtonText("loading");

                apiExplainCode(context?.token, code)
                    .then(async (res) => {
                        const data = await res.json();

                        setResponses([
                            { ...data, type: "explain-code" },
                            ...responses,
                        ]);
                        setStatus(StatusMessage.OK);
                        setCanUseToolbox(false);
                        setSelectedOption(null);
                        setQuestion("");
                        setCode("");
                    })
                    .catch(() => {
                        setStatus(StatusMessage.Failed);
                        setButtonText("ask");
                    });

                break;

            case HintOption.QuestionFromCode:
                if (!question && !code) {
                    setStatus(StatusMessage.QuestionAndCodeEmpty);
                } else if (!question) {
                    setStatus(StatusMessage.QuestionEmpty);
                } else if (!code) {
                    setStatus(StatusMessage.CodeEmpty);
                }

                setStatus(StatusMessage.Loading);
                setButtonText("loading");

                apiQuestionFromCode(context?.token, code, question)
                    .then(async (res) => {
                        const data = await res.json();

                        setResponses([
                            { ...data, type: "question-from-code" },
                            ...responses,
                        ]);
                        setStatus(StatusMessage.OK);
                        setCanUseToolbox(false);
                        setSelectedOption(null);
                        setQuestion("");
                        setCode("");
                    })
                    .catch(() => {
                        setStatus(StatusMessage.Failed);
                        setButtonText("ask");
                    });

                break;

            case HintOption.HelpFix:
                if (!code) {
                    setStatus(StatusMessage.CodeEmpty);
                }

                setStatus(StatusMessage.Loading);
                setButtonText("loading");

                apiHelpFixCode(context?.token, code)
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
                        setCode("");
                    })
                    .catch(() => {
                        setStatus(StatusMessage.Failed);
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
                setStatus(StatusMessage.Failed);
            });
    };

    return (
        <main className="home-container">
            <div className="ai-assistant">
                <div className="assistant-toolbox-container">
                    <div className="toolbox-container">
                        <div className="main-editor-container">
                            <div className="main-editor-header">Code: </div>
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
                                    Question:{" "}
                                </div>
                                <textarea
                                    className="main-question-input"
                                    onChange={(e) => {
                                        setQuestion(e.target.value);
                                    }}
                                    value={question}
                                    placeholder={"type question..."}
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
                                {/* <SelectableOption
                                    icon="wrench"
                                    option={HintOption.HelpFix}
                                    selected={
                                        selectedOption == HintOption.HelpFix
                                    }
                                    onClick={() =>
                                        setSelectedOption(HintOption.HelpFix)
                                    }
                                    codeIcon
                                /> */}
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
                                disabled={canUseToolbox ? false : true}
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
        </main>
    );
};
