import { Fragment, useContext, useEffect, useRef, useState } from "react";

import { AuthContext } from "../../context";

interface IProps {
    keyword: string;
}

export const HoverableKeyword = (props: IProps) => {
    const { context } = useContext(AuthContext);

    const [hovering, setHovering] = useState(false);

    return (
        <Fragment>
            <div
                className="hoverable-keyword-container"
                onMouseOver={() => {
                    setHovering(true);
                }}
                onMouseOut={() => {
                    setHovering(false);
                }}
            >
                <span
                    onMouseOver={() => {
                        setHovering(true);
                    }}
                    onMouseOut={() => {
                        setHovering(false);
                    }}
                    className="inline-code"
                >
                    {props.keyword}
                </span>
                {hovering && (
                    <div className="keyword-hovered-container">
                        <div>
                            example usages of{" "}
                            <span className="inline-code">{props.keyword}</span>
                        </div>
                        <div>
                            explain what{" "}
                            <span className="inline-code">{props.keyword}</span>{" "}
                            is and ask questions about it
                        </div>
                    </div>
                )}
            </div>
        </Fragment>
    );
};

export const responseToArrayWithKeywords = (response: string) => {
    // example: "word1 \`keyword1\` word2 \`keyword2\` word3"
    //  => ["word1", <HoverableKeyword keyword="keyword1" />,
    // "word2", <HoverableKeyword keyword="keyword2" />, "word3"]

    return response.split("`").map((item: string, index: number) => {
        if (index % 2 === 0) {
            return item;
        }
        return <HoverableKeyword keyword={item} />;
    });
};
