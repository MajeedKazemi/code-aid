import * as monaco from "monaco-editor";
import { useEffect, useRef, useState } from "react";
import { v4 as uuid } from "uuid";

import { highlightCode } from "../../utils/utils";

interface IProps {
    code: string;
    fixes: string[];
}

export const HoverableFixCode = (props: IProps) => {
    const [hovering, setHovering] = useState(false);
    const codeEl = useRef(null);

    useEffect(() => {
        if (codeEl.current) {
            monaco.editor.colorizeElement(codeEl.current as HTMLElement, {
                theme: "dark",
                mimeType: "c",
                tabSize: 4,
            });
        }
    }, [codeEl]);

    return (
        <div
            className="hoverable-code-line-container"
            onMouseEnter={() => {
                setHovering(true);
            }}
            onMouseLeave={() => {
                setHovering(false);
            }}
        >
            <span className={"hoverable-code"} ref={codeEl}>
                {props.code}
            </span>
            {hovering && props.fixes.length > 0 && (
                <div
                    className="hoverable-code-line-explanation"
                    onMouseEnter={() => {
                        setHovering(true);
                    }}
                    onMouseLeave={() => {
                        setHovering(false);
                    }}
                >
                    <ol>
                        {props.fixes.map((fix, i) => (
                            <li
                                key={"ol-" + i + "-" + uuid()}
                                dangerouslySetInnerHTML={{
                                    __html: highlightCode(
                                        fix,
                                        "exp-inline-code"
                                    ),
                                }}
                            ></li>
                        ))}
                    </ol>
                </div>
            )}
        </div>
    );
};
