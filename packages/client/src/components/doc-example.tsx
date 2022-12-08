import * as monaco from "monaco-editor";
import { useEffect, useRef, useState } from "react";

interface IExampleProps {
    title?: string;
    code: string;
    isError?: boolean;
    text?: string;
}

export const Example = (props: IExampleProps) => {
    const monacoEl = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (monacoEl.current) {
            monaco.editor.colorizeElement(monacoEl.current as HTMLElement, {
                theme: "vs",
                mimeType: "python",
                tabSize: 4,
            });
        }
    }, [monacoEl]);

    return (
        <div
            className={`example-container ${
                props.isError ? "example-error" : ""
            }`}
        >
            <h3 className="text-xl font-bold">
                {props.title ? props.title : "Example"}
            </h3>
            {props.text && <p>{props.text}</p>}

            <div ref={monacoEl} className="example-editor">
                {props.code}
            </div>
        </div>
    );
};
