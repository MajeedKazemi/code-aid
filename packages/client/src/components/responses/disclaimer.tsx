import { useState } from "react";

export const DisclaimerComponent = () => {
    const [showDisclaimer, setShowDisclaimer] = useState(true);

    if (!showDisclaimer) return null;

    return (
        <div className="disclaimer-container">
            <h1 className="disclaimer-title">Disclaimer</h1>
            <ul className="disclaimer-message">
                <li>
                    We are not promising that the responses are 100% correct.
                    Sometimes the tool is over-confident.
                </li>
                <li>
                    Usage data is being collected from all students to improve
                    the system over time.
                </li>
                <li>
                    Data collected from students that consent will also be used
                    in research after the course is completed.
                </li>
            </ul>
            <button
                className="disclaimer-button"
                onClick={() => {
                    setShowDisclaimer(false);
                }}
            >
                I understand, close
            </button>
        </div>
    );
};
