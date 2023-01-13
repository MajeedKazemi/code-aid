import { Fragment, useContext, useState } from "react";

import { AuthContext } from "../../context";
import { getIconSVG } from "../../utils/icons";
import { responseToArrayWithKeywords } from "./keyword";

interface IProps {
    data: { task: string; steps: string[]; id: string };
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
                                {responseToArrayWithKeywords(s).map(
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

            {/* <ResponseFeedback responseId={props.data.id} /> */}
        </div>
    );
};
