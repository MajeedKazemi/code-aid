import * as monaco from "monaco-editor";
import React, { useContext, useEffect, useRef, useState } from "react";

import { apiAnswerQuestion, apiBreakDownTask, apiExplainCode, apiQuestionFromCode } from "../api/api";
import { AuthContext } from "../context";
import { BreakDownStepsResponse } from "./responses/break-down-task-response";
import { ExplainCodeResponse } from "./responses/explain-code-response";
import { QuestionAnswerResponse } from "./responses/question-answer-response";
import { QuestionFromCodeResponse } from "./responses/question-from-code-response";
import { SelectableOption } from "./selectable-option";

export enum HintOption {
    AskQuestion = "ask question",
    ExplainCode = "explain given code",
    BreakDownSteps = "break down steps",
    HelpFix = "help fix given code",
    QuestionFromCode = "ask question from code",
}

export const MainComponent = () => {
    const { context } = useContext(AuthContext);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedOption, setSelectedOption] = useState<HintOption | null>(
        null
    );
    const [editor, setEditor] =
        useState<monaco.editor.IStandaloneCodeEditor | null>(null);

    const editorEl = useRef(null);

    const [question, setQuestion] = useState<string>("");
    const [code, setCode] = useState<string>("");
    const [questionHeader, setQuestionHeader] = useState<string>("");
    const [codeHeader, setCodeHeader] = useState<string>("");
    const [showPrompt, setShowPrompt] = useState<boolean>(true);
    const [showEditor, setShowEditor] = useState<boolean>(true);

    const [responses, setResponses] = useState<any[]>([]);

    useEffect(() => {
        if (editorEl && !editor) {
            const monacoEditor = monaco.editor.create(editorEl.current!, {
                value: code,
                language: "python",
                theme: "vs",
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
                break;

            case HintOption.ExplainCode:
                setQuestionHeader("");
                setCodeHeader("Code:");
                setShowPrompt(false);
                setShowEditor(true);
                break;

            case HintOption.BreakDownSteps:
                setQuestionHeader("Question:");
                setCodeHeader("");
                setShowPrompt(true);
                setShowEditor(false);
                break;

            case HintOption.HelpFix:
                setQuestionHeader("");
                setCodeHeader("Code:");
                setShowPrompt(false);
                setShowEditor(true);
                break;

            case HintOption.QuestionFromCode:
                setQuestionHeader("Question:");
                setCodeHeader("Code:");
                setShowPrompt(true);
                setShowEditor(true);
                break;
        }
    }, [selectedOption]);

    const performQuery = () => {
        if (!selectedOption) return;

        setLoading(true);

        switch (selectedOption) {
            case HintOption.AskQuestion:
                apiAnswerQuestion(context?.token, question).then(
                    async (res) => {
                        const data = await res.json();

                        setResponses([
                            { ...data, type: "question-answer" },
                            ...responses,
                        ]);
                        setLoading(false);
                    }
                );

                break;

            case HintOption.BreakDownSteps:
                apiBreakDownTask(context?.token, question).then(async (res) => {
                    const data = await res.json();

                    setResponses([
                        { ...data, type: "break-down-steps" },
                        ...responses,
                    ]);
                    setLoading(false);
                });

                break;

            case HintOption.ExplainCode:
                apiExplainCode(context?.token, code).then(async (res) => {
                    const data = await res.json();

                    setResponses([
                        { ...data, type: "explain-code" },
                        ...responses,
                    ]);
                    setLoading(false);
                });

                break;

            case HintOption.QuestionFromCode:
                apiQuestionFromCode(context?.token, code, question).then(
                    async (res) => {
                        const data = await res.json();

                        setResponses([
                            { ...data, type: "question-from-code" },
                            ...responses,
                        ]);
                        setLoading(false);
                    }
                );

                break;

            default:
                break;
        }
    };

    return (
        <main className="home-column-container">
            <div>
                <div>
                    <SelectableOption
                        option={HintOption.AskQuestion}
                        example="how can I generate a 2D array using malloc?"
                        selected={selectedOption == HintOption.AskQuestion}
                        onClick={() =>
                            setSelectedOption(HintOption.AskQuestion)
                        }
                    />
                    <SelectableOption
                        option={HintOption.ExplainCode}
                        selected={selectedOption == HintOption.ExplainCode}
                        onClick={() =>
                            setSelectedOption(HintOption.ExplainCode)
                        }
                    />
                    <SelectableOption
                        option={HintOption.BreakDownSteps}
                        example="how can I write binary numbers to a file?"
                        selected={selectedOption == HintOption.BreakDownSteps}
                        onClick={() =>
                            setSelectedOption(HintOption.BreakDownSteps)
                        }
                    />
                    <SelectableOption
                        option={HintOption.HelpFix}
                        selected={selectedOption == HintOption.HelpFix}
                        onClick={() => setSelectedOption(HintOption.HelpFix)}
                    />
                    <SelectableOption
                        option={HintOption.QuestionFromCode}
                        example="am I using pointers correctly?"
                        selected={selectedOption == HintOption.QuestionFromCode}
                        onClick={() =>
                            setSelectedOption(HintOption.QuestionFromCode)
                        }
                    />
                </div>

                <div className={showPrompt ? "" : "hidden-component"}>
                    <span>{questionHeader}</span>
                    <textarea
                        onChange={(e) => {
                            setQuestion(e.target.value);
                        }}
                        value={question}
                    ></textarea>
                </div>

                <div className={showEditor ? "" : "hidden-component"}>
                    <span>{codeHeader}</span>
                    <div className="mini-editor" ref={editorEl}></div>
                </div>
                <button onClick={performQuery}>ask</button>
                {loading ? <div>loading...</div> : null}

                <div>
                    {responses.map((response) => {
                        switch (response.type) {
                            case "question-answer":
                                return (
                                    <QuestionAnswerResponse
                                        key={response.id}
                                        data={response}
                                    />
                                );

                            case "break-down-steps":
                                return (
                                    <BreakDownStepsResponse
                                        key={response.id}
                                        data={response}
                                    />
                                );

                            case "explain-code":
                                return (
                                    <ExplainCodeResponse
                                        key={response.id}
                                        data={response}
                                    />
                                );

                            case "question-from-code":
                                return (
                                    <QuestionFromCodeResponse
                                        key={response.id}
                                        data={response}
                                    />
                                );

                            default:
                                return null;
                        }
                    })}
                </div>
            </div>

            {/* <div className="home-column">
                <Documentation />
            </div> */}
        </main>
    );
};
