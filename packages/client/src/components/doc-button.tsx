export interface IDocButton {
    name: string;
    id: string;
    selected?: boolean;
    onClick?: () => void;
}

export const DocButton = (props: IDocButton) => {
    return (
        <div
            className={`doc-button ${
                props.selected ? "doc-button-selected" : ""
            }`}
            onClick={() => {
                if (props.onClick) props.onClick();
            }}
        >
            {props.name}
        </div>
    );
};
