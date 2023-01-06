import { useContext, useState } from "react";

import { AuthContext } from "../../context";
import { highlightCode } from "../../utils/utils";

interface IProps {
    data: { task: string; steps: string[]; id: string };
}

export const BreakDownStepsResponse = (props: IProps) => {
    const { context } = useContext(AuthContext);

    return (
        <div>
            <div>{props.data.task}</div>
            <div>
                <ol>
                    {props.data.steps.map((s: string, i: number) => (
                        <li
                            key={i}
                            dangerouslySetInnerHTML={{
                                __html: highlightCode(s),
                            }}
                        ></li>
                    ))}
                </ol>
            </div>
        </div>
    );
};
