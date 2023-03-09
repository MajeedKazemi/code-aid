import { Fragment, useState } from "react";

export const UpdateNoticeComponent = () => {
    const [showNotice, setShowNotice] = useState(true);

    if (!showNotice) return null;

    return (
        <Fragment>
            <div
                className="background-overlay-whole-page"
                onClick={() => {
                    setShowNotice(false);

                    const closedUpdateNotice = localStorage.setItem(
                        "closed-update-notice",
                        "true"
                    );
                }}
            ></div>
            <div className="update-notice-container">
                <h1 className="update-notice-title">
                    🎉 🎊 🔥 Coding Assistant has been updated 🔥 🎊 🎉
                </h1>

                <h2>Here are some of the new features: </h2>

                <ul className="update-notice-message">
                    <li>
                        <b>Help Fix Code:</b> is now MUCH more accurate and will
                        display all the lines that need to be fixed.
                    </li>
                    <li>
                        <b>Ask Question:</b> provides more thorough responses
                        and can display some pseudocode (with explanations).
                    </li>
                    <li>
                        <b>Help Write Code:</b> now generates pseudocode (with
                        explanations).
                    </li>
                    <li>
                        <b>Standard Library Functions:</b> most responses will
                        also include hoverable man-pages for relevant standard
                        library functions.
                    </li>
                    <li>
                        <b>Follow-up Questions:</b> you can ask follow-up
                        questions on every feature (except Help Fix Code).
                    </li>
                </ul>
                <button
                    className="update-notice-button"
                    onClick={() => {
                        setShowNotice(false);

                        const closedUpdateNotice = localStorage.setItem(
                            "closed-update-notice",
                            "true"
                        );
                    }}
                >
                    {"Alright!"}
                </button>
            </div>
        </Fragment>
    );
};
