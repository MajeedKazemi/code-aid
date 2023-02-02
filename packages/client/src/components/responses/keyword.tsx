import { Fragment, useContext, useEffect, useRef, useState } from "react";
import { v4 as uuid } from "uuid";

import { getIconSVG } from "../../utils/icons";

interface IProps {
    keyword: string;
    askQuestion?: (question: string) => void;
    generateExample?: (keyword: string) => void;
    canUseToolbox?: boolean;
}

export const HoverableKeyword = (props: IProps) => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [hovering, setHovering] = useState(false);

    const displayError = (message: string) => {
        setErrorMessage(message);

        setTimeout(() => {
            setErrorMessage(null);
        }, 5000);
    };

    return (
        <Fragment>
            <div
                className="hoverable-keyword-container"
                onMouseEnter={() => {
                    setHovering(true);
                }}
                onMouseLeave={() => {
                    setHovering(false);
                }}
            >
                <span
                    onMouseEnter={() => {
                        setHovering(true);
                    }}
                    className="inline-hoverable-keyword"
                >
                    {props.keyword}
                </span>
                {hovering && (
                    <div
                        onMouseEnter={() => {
                            setHovering(true);
                        }}
                        onMouseLeave={() => {
                            setHovering(false);
                        }}
                        className="keyword-hovered-container"
                    >
                        <div className="keyword-hovered-header">
                            {"> more about this keyword:"}
                        </div>

                        <div className="keyword-hovered-buttons">
                            <button
                                className={
                                    "keyword-ask-button " +
                                    (props.canUseToolbox
                                        ? "keyword-ask-button-enabled"
                                        : "keyword-ask-button-disabled")
                                }
                                onClick={() => {
                                    if (!props.canUseToolbox) {
                                        displayError(
                                            "Please rate the last response before asking again"
                                        );

                                        return;
                                    }

                                    if (props.generateExample) {
                                        props.generateExample(props.keyword);
                                    }
                                }}
                            >
                                {getIconSVG(
                                    "command-line",
                                    "keyword-hover-icon"
                                )}
                                generate example code
                            </button>

                            <button
                                className={
                                    "keyword-ask-button " +
                                    (props.canUseToolbox
                                        ? "keyword-ask-button-enabled"
                                        : "keyword-ask-button-disabled")
                                }
                                onClick={() => {
                                    if (!props.canUseToolbox) {
                                        displayError(
                                            "Please rate the last response before asking again"
                                        );

                                        return;
                                    }

                                    if (props.askQuestion) {
                                        props.askQuestion(
                                            "generate a detailed documentation of `" +
                                                props.keyword +
                                                "` with usage examples and explanations"
                                        );
                                    }
                                }}
                            >
                                {getIconSVG(
                                    "magnifying-glass",
                                    "keyword-hover-icon"
                                )}
                                generate documentation
                            </button>

                            <button
                                className={
                                    "keyword-ask-button " +
                                    (props.canUseToolbox
                                        ? "keyword-ask-button-enabled"
                                        : "keyword-ask-button-disabled")
                                }
                                onClick={() => {
                                    if (!props.canUseToolbox) {
                                        displayError(
                                            "Please rate the last response before asking again"
                                        );

                                        return;
                                    }

                                    if (props.askQuestion) {
                                        props.askQuestion(
                                            "how can I use `" +
                                                props.keyword +
                                                "` ?"
                                        );
                                    }
                                }}
                            >
                                {getIconSVG("question", "keyword-hover-icon")}
                                ask question
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {errorMessage && (
                <div className="error-container">
                    <div className="error-message">{errorMessage}</div>
                </div>
            )}
        </Fragment>
    );
};

export const responseToArrayWithKeywords = (
    response: string,
    canUseToolbox?: boolean,
    askQuestion?: (question: string) => void,
    generateExample?: (keyword: string) => void
) => {
    // example: "word1 \`keyword1\` word2 \`keyword2\` word3"
    //  => ["word1", <HoverableKeyword keyword="keyword1" />,
    // "word2", <HoverableKeyword keyword="keyword2" />, "word3"]

    return response
        ? response.split("`").map((item: string, index: number) => {
              if (index % 2 === 0) {
                  return item;
              }
              return (
                  <HoverableKeyword
                      key={uuid()}
                      keyword={item}
                      askQuestion={askQuestion}
                      generateExample={generateExample}
                      canUseToolbox={canUseToolbox}
                  />
              );
          })
        : [];
};
