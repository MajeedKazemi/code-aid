import { Fragment, useContext, useState } from "react";

import { AuthContext } from "../../context";
import { getIconSVG } from "../../utils/icons";
import { ResponseFeedback } from "../response-feedback";
import { responseToArrayWithKeywords } from "./keyword";

interface IProps {
    admin?: boolean;
    canUseToolbox?: boolean;
    onSubmitFeedback?: () => void;
    generateExample?: (keyword: string) => void;
    askQuestion?: (question: string) => void;
    data: {
        task: string;
        steps: string[];
        id: string;
        feedback?: {
            reason: string;
            rating: number;
        };
    };
}

export const BreakDownStepsResponse = (props: IProps) => {
    const { context } = useContext(AuthContext);

    return (
        <div className="break-down-task-container">
            <div className="break-down-task-header">
                <Fragment>
                    {getIconSVG("bullet", "response-header-icon")}
                    {props.data.task}
                </Fragment>
            </div>
            <div className="break-down-response">
                <ol>
                    {props.data.steps.map((s: string, i: number) => (
                        <li className="break-down-response-step" key={i}>
                            <Fragment>
                                {responseToArrayWithKeywords(
                                    s,
                                    props.canUseToolbox,
                                    props.askQuestion,
                                    props.generateExample
                                ).map(
                                    (
                                        item: string | JSX.Element,
                                        index: number
                                    ) => {
                                        if (typeof item === "string") {
                                            return (
                                                <span key={"txt-" + index}>
                                                    {item}
                                                </span>
                                            );
                                        }

                                        return item;
                                    }
                                )}
                            </Fragment>
                        </li>
                    ))}
                </ol>
            </div>

            <ResponseFeedback
                admin={props.admin}
                priorData={props.data.feedback}
                responseId={props.data.id}
                onSubmitFeedback={props.onSubmitFeedback}
            />
        </div>
    );
};
