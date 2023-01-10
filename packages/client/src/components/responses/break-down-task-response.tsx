import { Fragment, useContext, useState } from "react";

import { AuthContext } from "../../context";
import { getIconSVG } from "../../utils/icons";
import { highlightCode } from "../../utils/utils";

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
                        <li
                            className="break-down-response-step"
                            key={i}
                            dangerouslySetInnerHTML={{
                                __html: highlightCode(s),
                            }}
                        ></li>
                    ))}
                </ol>
            </div>

            {/* <ResponseFeedback responseId={props.data.id} /> */}
        </div>
    );
};
