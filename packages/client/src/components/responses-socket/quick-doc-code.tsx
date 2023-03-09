import * as monaco from "monaco-editor";
import React, { Fragment, useEffect, useRef, useState } from "react";

interface IQuickDocCode {
    code: string;
}

export const QuickDocCode = (props: IQuickDocCode) => {
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
        <div className="quick-doc-code" ref={codeEl}>
            {props.code}
        </div>
    );
};

export const QuickDocInlineCode = (props: IQuickDocCode) => {
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
        <span className="quick-doc-inline-code" ref={codeEl}>
            {props.code}
        </span>
    );
};
