import { useContext, useState } from "react";

import { AuthContext } from "../context";

interface IProps {
    responseId: string;
    followUpId?: string;
    onSubmit?: () => void;
}

export const ResponseFeedback = (props: IProps) => {
    const { context } = useContext(AuthContext);

    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [reason, setReason] = useState("");
    const [submitted, setSubmitted] = useState(false);

    if (submitted) return null;

    return (
        <div>
            <span>how useful was this response?</span>
            <span
                className={
                    "feedback-option-yes " +
                    (selectedOption === "yes"
                        ? "feedback-option-selected-yes"
                        : "")
                }
                onClick={() => {
                    setSelectedOption("yes");
                }}
            >
                yes
            </span>
            <span
                className={
                    "feedback-option-no " +
                    (selectedOption === "no"
                        ? "feedback-option-selected-no"
                        : "")
                }
                onClick={() => {
                    setSelectedOption("no");
                }}
            >
                no
            </span>

            {selectedOption !== null ? (
                <textarea
                    value={reason}
                    onChange={(e) => {
                        setReason(e.target.value);
                    }}
                ></textarea>
            ) : null}
            <button
                onClick={() => {
                    setSubmitted(true);
                }}
            >
                submit
            </button>
        </div>
    );
};
