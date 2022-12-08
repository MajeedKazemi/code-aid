import React from "react";

interface IProps {
    children: React.ReactNode;
}

export const Message = (props: IProps) => {
    return <div className="doc-message">{props.children}</div>;
};
