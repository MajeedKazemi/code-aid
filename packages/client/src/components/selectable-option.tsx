import React, { Fragment, useState } from "react";

import { getIconSVG } from "../utils/icons";

interface ISelectableOptionProps {
    icon?: string;
    option: string;
    example?: string;
    selected: boolean;
    onClick: () => void;
    codeIcon?: boolean;
}

export const SelectableOption = (props: ISelectableOptionProps) => {
    return (
        <div
            onClick={props.onClick}
            className={
                "selectable-option " +
                (props.selected ? " option-selected" : "")
            }
        >
            <div className="icon-and-text">
                {getIconSVG(
                    props.icon ? props.icon : "lock-closed",
                    "selectable-option-icon"
                )}
                <span>{props.option}</span>
            </div>

            {props.codeIcon &&
                getIconSVG("code", "code-icon selectable-option-icon")}
        </div>
    );
};
