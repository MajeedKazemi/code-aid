import { getIconSVG } from "../utils/icons";

interface ButtonProps {
    children: React.ReactNode;
    onClick?: (e: any) => void;
    icon?: string;
    class?: string;
    type?: "link" | "button" | "block" | "block-inline" | "block-big";
    disabled?: boolean;
    color?: "warning" | "primary";
}

export const Button = (props: ButtonProps) => {
    let style = props.class;

    switch (props.type) {
        case "link":
            style += " btn-link";
            break;

        case "block":
            style += " btn btn-block";
            break;

        case "block-inline":
            style += " btn btn-block-inline";
            break;

        case "block-big":
            style += " btn btn-block btn-block-big";
            break;

        default:
            style += " btn";
    }

    if (props.disabled) {
        style += " disabled";
    }

    if (props.color) {
        style += ` btn-color-${props.color}`;
    }

    return (
        <button
            className={style}
            onClick={props.onClick}
            disabled={props.disabled}
        >
            {props.children}
            {getIconSVG(props.icon, "icon")}
        </button>
    );
};
