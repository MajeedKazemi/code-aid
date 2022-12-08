import React from "react";

interface IProps {
    children: React.ReactNode;
}

export const Code = (props: IProps) => {
    return <span className="inline-code">{props.children}</span>;
};
