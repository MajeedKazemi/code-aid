import { Fragment, useContext, useState } from "react";
import { Link } from "react-router-dom";

import { apiReplyAnswerQuestion } from "../../api/api";
import { AuthContext } from "../../context";
import { getIconSVG } from "../../utils/icons";
import { StatusMessage } from "../coding-assistant";
import { ResponseFeedback } from "../response-feedback";
import { responseToArrayWithKeywords } from "./keyword";

interface IProps {
    admin?: boolean;
    setCanUseToolbox?: (canUseToolbox: boolean) => void;
    canUseToolbox?: boolean;
    onSubmitFeedback?: () => void;
    generateExample?: (keyword: string) => void;
    askQuestion?: (question: string) => void;
    data: {
        question: string;
        answer: string;
        id: string;
        query: string;
        followUps: Array<{
            time: Date;
            query: string;
            id: string;
            question: string;
            answer: string;
            feedback?: {
                reason: string;
                rating: number;
            };
        }>;
        feedback?: {
            reason: string;
            rating: number;
        };
    };
}

export const QuestionAnswerResponse = (props: IProps) => {
    const { context } = useContext(AuthContext);

    const [status, setStatus] = useState<StatusMessage>(StatusMessage.OK);
    const [followUpQuestion, setFollowUpQuestion] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [followUps, setFollowUps] = useState<
        Array<{
            time: Date;
            query: string;
            id: string;
            question: string;
            answer: string;
            feedback?: {
                reason: string;
                rating: number;
            };
        }>
    >(props.data.followUps || []);

    const displayError = (message: string) => {
        setErrorMessage(message);

        setTimeout(() => {
            setErrorMessage(null);
        }, 5000);
    };

    return (
        <div className="question-answer-main-container">
            {props.admin && (
                <Link
                    target="_blank"
                    className="admin-response-link"
                    to={`/response{props.data.id}`}
                >
                    Link: {props.data.id}{" "}
                </Link>
            )}
            <div className="main-question">
                <Fragment>
                    {getIconSVG("question", "response-header-icon")}
                    {props.data.question}
                </Fragment>
            </div>
            <div className="question-answer-main-content">
                <div>
                    <Fragment>
                        {responseToArrayWithKeywords(
                            props.data.answer,
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
                <div className="follow-up-responses">
                    {followUps.map((f) => {
                        return (
                            <div
                                key={f.id}
                                className="follow-up-response-container"
                            >
                                <div className="follow-up-question">
                                    <div>
                                        {getIconSVG(
                                            "question",
                                            "response-header-icon"
                                        )}
                                    </div>
                                    {f.question}
                                </div>
                                <div className="follow-up-answer">
                                    <Fragment>
                                        {responseToArrayWithKeywords(
                                            f.answer,
                                            props.canUseToolbox,
                                            props.askQuestion,
                                            props.generateExample
                                        ).map(
                                            (
                                                item: string | JSX.Element,
                                                index: number
                                            ) => {
                                                if (typeof item === "string") {
                                                    return (
                                                        <span
                                                            key={"txt-" + index}
                                                        >
                                                            {item}
                                                        </span>
                                                    );
                                                }

                                                return item;
                                            }
                                        )}
                                    </Fragment>
                                </div>

                                <ResponseFeedback
                                    admin={props.admin}
                                    priorData={f.feedback}
                                    responseId={props.data.id}
                                    followUpId={f.id}
                                    onSubmitFeedback={props.onSubmitFeedback}
                                />
                            </div>
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
                            let prevQuestions =
                                followUps.length > 0
                                    ? followUps[followUps.length - 1].query
                                    : props.data.query;

                            if (followUpQuestion.length < 3) {
                                displayError(
                                    "Please specify your follow-up question more clearly."
                                );

                                return;
                            }

                            setStatus(StatusMessage.Loading);

                            apiReplyAnswerQuestion(
                                context?.token,
                                props.data.id,
                                prevQuestions,
                                followUpQuestion
                            )
                                .then(async (res) => {
                                    const data = await res.json();

                                    setFollowUps([...followUps, { ...data }]);
                                    setStatus(StatusMessage.OK);
                                    setFollowUpQuestion("");

                                    if (props.setCanUseToolbox) {
                                        props.setCanUseToolbox(false);
                                    }
                                })
                                .catch(() => {
                                    displayError(
                                        "Failed to generate example. Please try again or reload the page."
                                    );
                                });
                        }}
                    >
                        ask
                    </button>
                </div>

                {status !== StatusMessage.OK ? (
                    <div className="status-message-container">{status}</div>
                ) : null}

                <ResponseFeedback
                    admin={props.admin}
                    priorData={props.data.feedback}
                    responseId={props.data.id}
                    onSubmitFeedback={props.onSubmitFeedback}
                />
            </div>

            {errorMessage && (
                <div className="error-container">
                    <div className="error-message">{errorMessage}</div>
                </div>
            )}
        </div>
    );
};
