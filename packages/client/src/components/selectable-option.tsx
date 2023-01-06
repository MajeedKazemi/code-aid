import React, { useState } from "react";

interface ISelectableOptionProps {
    option: string;
    example?: string;
    selected: boolean;
    onClick: () => void;
}

export const SelectableOption = (props: ISelectableOptionProps) => {
    return (
        <div
            onClick={props.onClick}
            className={
                props.selected
                    ? "selectable-option option-selected"
                    : "selectable-option"
            }
        >
            {props.example ? props.option + ":" + props.example : props.option}
        </div>
    );
};
