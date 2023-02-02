import { Fragment, useContext, useState } from "react";

import { apiSetFeedback } from "../api/api";
import { AuthContext } from "../context";
import { getIconSVG } from "../utils/icons";

interface IProps {
    admin?: boolean;
    priorData?: {
        rating: number;
        reason: string;
    };
    responseId: string;
    followUpId?: string;
    onSubmitFeedback?: () => void;
}

export const ResponseFeedback = (props: IProps) => {
    const { context } = useContext(AuthContext);

    const [selectedNumber, setSelectedNumber] = useState(0);
    const [hoveredNumber, setHoveredNumber] = useState(0);
    const [reason, setReason] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const displayError = (message: string) => {
        setErrorMessage(message);

        setTimeout(() => {
            setErrorMessage(null);
        }, 5000);
    };

    if (props.admin && (props.priorData?.rating || submitted))
        return (
            <div>
                <br />
                <hr />
                <div>user rating: {props.priorData?.rating}</div>
                {props.priorData?.reason && (
                    <div>reason: {props.priorData?.reason}</div>
                )}
            </div>
        );
    else if (props.admin) return null;

    if (props.priorData?.rating || submitted) return null;

    return (
        <div className="response-feedback-container">
            <div className="response-feedback-header">
                how useful was this response?
            </div>
            <div className="response-feedback-content">
                <div
                    className="star-icons-container"
                    onMouseOut={() => {
                        setHoveredNumber(0);
                    }}
                >
                    <span
                        className="single-star-icon-container"
                        onMouseOver={() => {
                            setHoveredNumber(1);
                        }}
                        onClick={() => {
                            setSelectedNumber(1);
                        }}
                    >
                        {getIconSVG(
                            "star" +
                                (hoveredNumber >= 1 || selectedNumber >= 1
                                    ? "-filled"
                                    : "-stroke"),
                            selectedNumber >= 1 ? "response-star-selected" : ""
                        )}
                    </span>
                    <span
                        className="single-star-icon-container"
                        onMouseOver={() => {
                            setHoveredNumber(2);
                        }}
                        onClick={() => {
                            setSelectedNumber(2);
                        }}
                    >
                        {getIconSVG(
                            "star" +
                                (hoveredNumber >= 2 || selectedNumber >= 2
                                    ? "-filled"
                                    : "-stroke"),
                            selectedNumber >= 2 ? "response-star-selected" : ""
                        )}
                    </span>
                    <span
                        className="single-star-icon-container"
                        onMouseOver={() => {
                            setHoveredNumber(3);
                        }}
                        onClick={() => {
                            setSelectedNumber(3);
                        }}
                    >
                        {getIconSVG(
                            "star" +
                                (hoveredNumber >= 3 || selectedNumber >= 3
                                    ? "-filled"
                                    : "-stroke"),
                            selectedNumber >= 3 ? "response-star-selected" : ""
                        )}
                    </span>
                    <span
                        className="single-star-icon-container"
                        onMouseOver={() => {
                            setHoveredNumber(4);
                        }}
                        onClick={() => {
                            setSelectedNumber(4);
                        }}
                    >
                        {getIconSVG(
                            "star" +
                                (hoveredNumber >= 4 || selectedNumber >= 4
                                    ? "-filled"
                                    : "-stroke"),
                            selectedNumber >= 4 ? "response-star-selected" : ""
                        )}
                    </span>
                    <span
                        className="single-star-icon-container"
                        onMouseOver={() => {
                            setHoveredNumber(5);
                        }}
                        onClick={() => {
                            setSelectedNumber(5);
                        }}
                    >
                        {getIconSVG(
                            "star" +
                                (hoveredNumber >= 5 || selectedNumber >= 5
                                    ? "-filled"
                                    : "-stroke"),
                            selectedNumber >= 5 ? "response-star-selected" : ""
                        )}
                    </span>
                </div>
                {selectedNumber !== 0 ? (
                    <textarea
                        placeholder="please explain why"
                        className="feedback-reason-textarea"
                        value={reason}
                        onChange={(e) => {
                            setReason(e.target.value);
                        }}
                    ></textarea>
                ) : null}

                <span
                    className={
                        "submit-feedback-button " +
                        (selectedNumber == 0 ? "feedback-button-disabled" : "")
                    }
                    onClick={() => {
                        if (selectedNumber == 0) {
                            displayError("Please select a rating");

                            return;
                        }

                        apiSetFeedback(
                            context?.token,
                            props.responseId,
                            props.followUpId ? props.followUpId : null,
                            selectedNumber,
                            reason
                        )
                            .then(async (res) => {
                                if (res.status === 200) {
                                    setSubmitted(true);

                                    if (props.onSubmitFeedback) {
                                        props.onSubmitFeedback();
                                    }
                                }
                            })
                            .catch((err) => {
                                displayError(
                                    "Error submitting feedback. Please try again or reload the page."
                                );
                            });
                    }}
                >
                    submit
                </span>
            </div>

            {errorMessage && (
                <div className="error-container">
                    <div className="error-message">{errorMessage}</div>
                </div>
            )}
        </div>
    );
};
