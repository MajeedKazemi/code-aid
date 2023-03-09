import { Fragment, useState } from "react";
import TextArea from "react-textarea-autosize";

import { getIconSVG } from "../../utils/icons";
import { highlightCode } from "../../utils/utils";
import { StatusMessage } from "../coding-assistant";

interface IProps {
    suggestions: string[] | undefined;
    canUseToolbox?: boolean;
    status: StatusMessage;
    buttonText: string;
    onFollowUp: (question: string) => void;
}

export const FollowUp = (props: IProps) => {
    const [followUpQuestion, setFollowUpQuestion] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const displayError = (message: string) => {
        setErrorMessage(message);

        setTimeout(() => {
            setErrorMessage(null);
        }, 5000);
    };

    return (
        <div className="follow-up-input-container">
            <div className="suggested-follow-up-questions-container">
                <div className="suggested-follow-up-questions-header">
                    <b>Suggested Follow-Up Questions:</b>
                </div>
                {props.suggestions?.map((s) => {
                    return (
                        <Fragment key={JSON.stringify(s)}>
                            <div
                                className="follow-up-question-suggestion"
                                onClick={() => {
                                    setFollowUpQuestion(s);
                                }}
                            >
                                {getIconSVG(
                                    "magnifying-glass",
                                    "follow-up-icon"
                                )}
                                <span
                                    dangerouslySetInnerHTML={{
                                        __html: highlightCode(
                                            s,
                                            "inline-code-subtle"
                                        ),
                                    }}
                                ></span>
                            </div>
                            <br />
                        </Fragment>
                    );
                })}
            </div>

            <div className="follow-up-question-input-container">
                <TextArea
                    placeholder="follow up question"
                    className="follow-up-question-input"
                    onChange={(e) => {
                        setFollowUpQuestion(e.target.value);
                    }}
                    value={followUpQuestion}
                    maxRows={3}
                ></TextArea>

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

                        props.onFollowUp(followUpQuestion);
                        setFollowUpQuestion("");
                    }}
                >
                    {props.buttonText}
                </button>
            </div>

            {props.status !== StatusMessage.OK ? (
                <div className="status-message-container">{props.status}</div>
            ) : null}

            {errorMessage && (
                <div className="error-container">
                    <div className="error-message">{errorMessage}</div>
                </div>
            )}
        </div>
    );
};
