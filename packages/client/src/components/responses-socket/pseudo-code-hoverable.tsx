import { v4 as uuid } from "uuid";

import { HoverableExplainCode } from "../responses/hoverable-explain-code";

interface IProps {
    code?: {
        code?: string;
        explanation?: string;
    }[];
}

export const PseudoCodeHoverable = (props: IProps) => {
    return (
        <div>
            <div className="explain-code-content">
                Hover over each line to see detailed explanation:
            </div>

            <div className="explained-code">
                {props.code &&
                    props.code.map((line, index) => {
                        return (
                            <HoverableExplainCode
                                code={line.code || ""}
                                explanation={line.explanation || ""}
                                key={
                                    "hoverable-line-code-" +
                                    index +
                                    "-" +
                                    uuid()
                                }
                            />
                        );
                    })}
            </div>
        </div>
    );
};
