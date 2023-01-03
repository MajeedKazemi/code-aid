import { useContext, useEffect, useRef, useState } from "react";

import { apiAnswerQuestion } from "../api/api";
import { AuthContext } from "../context";
import { Button } from "./button";

interface IQuestionAnswerProps {}

export const AnswerQuestionComp = (props: IQuestionAnswerProps) => {
    const [queries, setQueries] = useState<
        Array<{ question: string; answer: string }>
    >([]);
    const [question, setQuestion] = useState("");
    const { context } = useContext(AuthContext);

    return (
        <div className="hint-generator-component">
            <h2>hint-generator v1</h2>
            <textarea
                onChange={(e) => {
                    setQuestion(e.target.value);
                }}
            ></textarea>
            <Button
                onClick={() => {
                    apiAnswerQuestion(context?.token, question).then(
                        async (res) => {
                            const data = await res.json();
                            setQueries([
                                { question: question, answer: data.answer },
                                ...queries,
                            ]);
                            setQuestion("");
                        }
                    );
                }}
            >
                Answer Question
            </Button>
            <div>
                {queries.map((query) => {
                    return (
                        <div className="answer-container">
                            <div>{query.question}</div>
                            <hr />
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: query.answer.replace(
                                        /`([^`]+)`/g,
                                        '<span class="inline-code">$1</span>'
                                    ),
                                }}
                            ></div>
                            <hr />
                            <div>how useful was this answer?</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
