import React, { Fragment, useEffect, useRef, useState } from "react";

import { getIconSVG } from "../../utils/icons";
import { highlightCode } from "../../utils/utils";
import { QuickDocCode, QuickDocInlineCode } from "./quick-doc-code";

interface IQuickDocumentationProps {
    name: string;
    data?: {
        summary: string;
        synopsis: string;
        include: Array<string>;
        examples: Array<{
            title: string;
            code: string;
        }>;
        description: string;
        return: string;
        notes: string;
        bugs: string;
        similar: Array<string>;
    };
}

export const QuickDocumentation = (props: IQuickDocumentationProps) => {
    const [hovering, setHovering] = useState(false);

    return (
        <div
            className="hoverable-quick-documentation"
            onMouseEnter={() => {
                setHovering(true);
            }}
            onMouseLeave={() => {
                setHovering(false);
            }}
        >
            <span className="hoverable-function-name">
                <Fragment>
                    {getIconSVG(
                        "cursor-arrow-rays",
                        "hoverable-func-name-icon"
                    )}
                    {props.name}
                </Fragment>
            </span>
            {hovering && props.data && (
                <div
                    className="hoverable-quick-doc-container"
                    onMouseEnter={() => {
                        setHovering(true);
                    }}
                    onMouseLeave={() => {
                        setHovering(false);
                    }}
                >
                    <div className="quick-doc-summary">
                        <span className="quick-doc-part-title">
                            {"Summary: "}
                        </span>
                        <span>{props.data.summary}</span>
                    </div>
                    <div className="quick-doc-main-content">
                        <div className="quick-doc-part">
                            <span className="quick-doc-part-title">
                                {"Prototype: "}
                            </span>
                            <QuickDocInlineCode code={props.data.synopsis} />
                        </div>

                        <div className="quick-doc-part">
                            <span className="quick-doc-part-title">
                                {"Include: "}
                            </span>
                            {props.data.include.map((include, index) => (
                                <QuickDocInlineCode code={include} />
                            ))}
                        </div>

                        {props.data.examples.map((example, index) => (
                            <div className="quick-doc-code-container">
                                <div className="quick-doc-code-title">
                                    {"Example Usage:"}
                                </div>
                                <QuickDocCode code={example.code} />
                            </div>
                        ))}

                        <div className="quick-doc-part">
                            <span className="quick-doc-part-title">
                                {"Description: "}
                            </span>
                            <span
                                dangerouslySetInnerHTML={{
                                    __html: highlightCode(
                                        props.data.description,
                                        "inline-code-subtle"
                                    ),
                                }}
                            ></span>
                        </div>

                        <div className="quick-doc-part">
                            <span className="quick-doc-part-title">
                                {"Return Value: "}
                            </span>
                            <span
                                dangerouslySetInnerHTML={{
                                    __html: highlightCode(
                                        props.data.return,
                                        "inline-code-subtle"
                                    ),
                                }}
                            ></span>
                        </div>

                        <div className="quick-doc-part">
                            <span className="quick-doc-part-title">
                                {"Additional Notes: "}
                            </span>
                            <span
                                dangerouslySetInnerHTML={{
                                    __html: highlightCode(
                                        props.data.notes,
                                        "inline-code-subtle"
                                    ),
                                }}
                            ></span>
                        </div>

                        <div className="quick-doc-part">
                            <span className="quick-doc-part-title">
                                {"Known Bugs: "}
                            </span>
                            <span
                                dangerouslySetInnerHTML={{
                                    __html: highlightCode(
                                        props.data.notes,
                                        "inline-code-subtle"
                                    ),
                                }}
                            ></span>
                        </div>

                        <div>
                            <span className="quick-doc-part-title">
                                {"Similar Functions: "}
                            </span>
                            {props.data.similar.map((similar, index) => (
                                <span className="quick-doc-similar-functions inline-code-subtle">
                                    {similar}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
