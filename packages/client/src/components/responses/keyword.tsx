import { Fragment, useContext, useEffect, useRef, useState } from "react";
import { v4 as uuid } from "uuid";

import { AuthContext } from "../../context";

interface IProps {
    keyword: string;
    askQuestion: (question: string) => void;
    generateExample: (keyword: string) => void;
    canUseToolbox: boolean;
}

export const HoverableKeyword = (props: IProps) => {
    const { context } = useContext(AuthContext);

    const [hovering, setHovering] = useState(false);

    return (
        <Fragment>
            <div
                className="hoverable-keyword-container"
                onMouseOver={() => {
                    setHovering(true);
                }}
                onMouseOut={() => {
                    setHovering(false);
                }}
            >
                <span
                    onMouseOver={() => {
                        setHovering(true);
                    }}
                    onMouseOut={() => {
                        setHovering(false);
                    }}
                    className="inline-code"
                >
                    {props.keyword}
                </span>
                {hovering && (
                    <div className="keyword-hovered-container">
                        <span>
                            show me example usages of{" "}
                            <span className="keyword-inline-code">
                                {props.keyword}
                            </span>
                            :{" "}
                        </span>
                        <button
                            className="keyword-ask-button"
                            disabled={!props.canUseToolbox}
                            onClick={() => {
                                props.generateExample(props.keyword);
                            }}
                        >
                            ask
                        </button>

                        <br />
                        <br />

                        <span>
                            explain{" "}
                            <span className="keyword-inline-code">
                                {props.keyword}
                            </span>{" "}
                            or ask questions about it:{" "}
                        </span>
                        <button
                            className="keyword-ask-button"
                            disabled={!props.canUseToolbox}
                            onClick={() => {
                                props.askQuestion(props.keyword);
                            }}
                        >
                            ask
                        </button>
                    </div>
                )}
            </div>
        </Fragment>
    );
};

export const responseToArrayWithKeywords = (
    response: string,
    canUseToolbox: boolean,
    askQuestion: (question: string) => void,
    generateExample: (keyword: string) => void
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
