import { useState } from "react";

export const DisclaimerComponent = () => {
    const [showDisclaimer, setShowDisclaimer] = useState(true);

    if (!showDisclaimer) return null;

    return (
        <div className="disclaimer-container">
            <h1 className="disclaimer-title">Disclaimer</h1>
            <ul className="disclaimer-message">
                <li>
                    Please note that the tool may at times generate responses
                    with excessive confidence or be slightly incorrect.
                </li>
                <li>
                    Usage data is being collected from all students to improve
                    the system over time.
                </li>
                <li>
                    Only data collected from students who have provided informed
                    consent to participate in the research study will be used
                    for research purposes.
                </li>
            </ul>
            <button
                className="disclaimer-button"
                onClick={() => {
                    setShowDisclaimer(false);

                    const lastTimeAcceptedDisclaimer = localStorage.setItem(
                        "disclaimer-accepted-timestamp",
                        Date.now().toString()
                    );
                }}
            >
                I understand
            </button>
        </div>
    );
};
