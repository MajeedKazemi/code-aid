import * as monaco from "monaco-editor";
import { useContext, useEffect, useRef, useState } from "react";

import { apiExplainCode } from "../api/api";
import { AuthContext } from "../context";
import { Button } from "./button";

interface IExplainCodeCompProps {}

export const ExplainCodeComp = (props: IExplainCodeCompProps) => {
    const { context } = useContext(AuthContext);
    const monacoEl = useRef(null);
    const [editor, setEditor] =
        useState<monaco.editor.IStandaloneCodeEditor | null>(null);
    const [explanations, setExplanations] = useState<
        Array<{ code: string; explanation: string }>
    >([]);
    const [question, setQuestion] = useState("");

    useEffect(() => {
        if (monacoEl && !editor) {
            setEditor(
                monaco.editor.create(monacoEl.current!, {
                    value: [
                        `num1 = int(input('enter the first number: '))`,
                        `num2 = int(input('enter the second number: '))`,
                        `print(str(num1) + " times " + str(num2) + " = " + str(num1 * num2))`,
                    ].join("\n"),
                    language: "python",
                    theme: "vs",
                    automaticLayout: true,
                    fontSize: 18,
                    lineHeight: 30,
                })
            );
        }

        return () => editor?.dispose();
    }, [monacoEl.current]);

    const getSelectedCode = () => {
        let code = editor?.getModel()?.getValue();
        const selection = editor?.getSelection();

        if (selection) {
            const selectedCode = editor?.getModel()?.getValueInRange(selection);

            if (selectedCode && selectedCode.length > 0) {
                code = selectedCode;
            }
        }

        return code;
    };

    return (
        <div className="code-explain-question-component">
            <h2>explain code, specific question</h2>
            <div className="mini-editor" ref={monacoEl}></div>

            <Button
                onClick={() => {
                    const code = getSelectedCode();

                    if (code && code?.length > 0) {
                        apiExplainCode(context?.token, code).then(
                            async (res) => {
                                const data = await res.json();

                                setExplanations([
                                    {
                                        code: code as string,
                                        explanation: data.explanation,
                                    },
                                    ...explanations,
                                ]);
                            }
                        );
                    } else {
                        prompt(
                            "Please select or enter some code before hitting the explain button"
                        );
                    }
                }}
            >
                Explain Code
            </Button>
            {/* <br />
            <br />
            <Input
                onChange={(e) => {
                    setQuestion(e.target.value);
                }}
            ></Input>
            <Button
                onClick={() => {
                    const code = getSelectedCode();

                    if (code && code?.length > 0 && question?.length > 0) {
                        apiAnswerQuestionFromCode(
                            context?.token,
                            question,
                            code
                        ).then(async (res) => {
                            const data = await res.json();

                            setExplanations([
                                {
                                    code: code as string,
                                    explanation: data.explanation,
                                },
                                ...explanations,
                            ]);

                            setQuestion("");
                        });
                    } else {
                        prompt(
                            "Please select or enter some code before hitting the explain button"
                        );
                    }
                }}
            >
                Ask Question
            </Button> */}
            <div>
                {explanations.map((exp) => {
                    return (
                        <div>
                            <div>{exp.code}</div>
                            <div
                                className="answer-container"
                                dangerouslySetInnerHTML={{
                                    __html: exp.explanation.replace(
                                        /`([^`]+)`/g,
                                        '<span class="inline-code">$1</span>'
                                    ),
                                }}
                            ></div>
                            <span>how useful this answer was?</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
