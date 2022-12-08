interface InputProps {
    placeholder?: string;
    onChange?: (e: any) => void;
    value?: string;
    class?: string;
    type?: string;
}

export const Input = (props: InputProps) => {
    return (
        <input
            className={`input ${props.class}`}
            placeholder={props.placeholder}
            onChange={props.onChange}
            type={props.type}
            value={props.value}
        />
    );
};
