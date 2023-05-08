interface IRawResponseProps {
    raw: string;
}

export const RawResponseAdmin = (props: IRawResponseProps) => {
    return (
        <div>
            {props.raw.split("\n").map((line, index) => {
                return <div key={index}>{line}</div>;
            })}
        </div>
    );
};
