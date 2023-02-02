import { useEffect, useState } from "react";

interface IProps {
    priorRating?: number;
    question: string;
    options: string[];
    onChange: (value: number) => void;
}

export const LikertScale = (props: IProps) => {
    const [selected, setSelected] = useState<number | null>(
        props.priorRating || null
    );

    return (
        <div className="likert-component">
            <div>
                <h4>{"> " + props.question}</h4>
            </div>
            <div className="likert-options-container">
                {props.options.map((option, index) => {
                    return (
                        <div className="likert-option" key={index}>
                            <label>
                                <input
                                    type="radio"
                                    value={index}
                                    checked={selected === index}
                                    onChange={(e) => {
                                        setSelected(parseInt(e.target.value));
                                        props.onChange(
                                            parseInt(e.target.value)
                                        );
                                    }}
                                />
                                {option}
                            </label>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
