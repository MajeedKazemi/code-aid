import { Fragment, useState } from "react";

import { Accordion } from "../accordion";
import { Example } from "../doc-example";
import { Code } from "../doc-inline-code";
import { Message } from "../doc-message";
import { IDocPageProps } from "./types";

export const ErrorsDoc = (props: IDocPageProps) => {
    const [current, setCurrent] = useState("");

    return (
        <Fragment>
            <h1 className="doc-title">Syntax Error Guide</h1>

            <Accordion
                title="SyntaxError: `invalid syntax`"
                sectionId="error-invalid-syntax"
                pageId={props.pageId}
                click={(next: string) => {
                    props.onSectionChange(current, next);
                    setCurrent(next);
                }}
                current={current}
            >
                <b>This may be because:</b>
                <ul>
                    <li>
                        you missed a colon <Code>:</Code> at the end of an{" "}
                        <Code>if</Code> statement, a <Code>for</Code> loop, a{" "}
                        <Code>while</Code> loop, etc.
                    </li>
                    <li>
                        you missed a closing parenthesis or brackets{" "}
                        <Code>{")"}</Code>
                    </li>
                    <li>
                        you used a single equality sign <Code>=</Code> rather
                        than a double equality sign <Code>==</Code> when
                        comparing values
                    </li>
                </ul>
                <Message>
                    Refer to the <b>Syntax</b> section in the documentation
                </Message>
            </Accordion>

            <Accordion
                title="ValueError: `invalid literal for int() with base 10`"
                sectionId="error-invalid-literal-for-int"
                pageId={props.pageId}
                click={(next: string) => {
                    props.onSectionChange(current, next);
                    setCurrent(next);
                }}
                current={current}
            >
                <b>This may be because:</b>
                <ul>
                    <li>
                        You are trying to convert a string to an integer, but
                        the string is not a number and it contains non-numeric
                        characters.
                    </li>
                    <li>
                        This usually happens if you are converting the value
                        received from the user input to an integer (using{" "}
                        <Code>int( )</Code>) but the user did not correctly
                        enter a number, and instead, entered non-numeric
                        characters.
                    </li>
                </ul>
            </Accordion>

            <Accordion
                title="TypeError: `can only concatenate ___ to ___`"
                sectionId="error-concatenate-type"
                pageId={props.pageId}
                click={(next: string) => {
                    props.onSectionChange(current, next);
                    setCurrent(next);
                }}
                current={current}
            >
                <b>This may be because:</b>
                <ul>
                    <li>
                        you tried to add or concatenate two items of different
                        types
                    </li>
                    <li>
                        For example when you use the <Code>+</Code> operator to
                        join a string and a number{" "}
                        <Code>print("number " + 123)</Code>
                    </li>
                    <li>
                        You could fix this by wrapping the non-string
                        (non-textual) item with an <Code>str( )</Code> to
                        manually convert it to a string (text)
                    </li>
                </ul>
                <Message>
                    <p>
                        Refer to the "Useful Tools For Data Types" under the
                        "Data Types" section in the documentation
                    </p>
                </Message>
            </Accordion>
            <Accordion
                title="NameError: `name ___ is not defined`"
                sectionId="error-name-not-defined"
                pageId={props.pageId}
                click={(next: string) => {
                    props.onSectionChange(current, next);
                    setCurrent(next);
                }}
                current={current}
            >
                <b>This may be because:</b>
                <ul>
                    <li>
                        you tried to use a variable that has yet to be defined
                        or assigned a value
                    </li>
                    <li>
                        you forgot to put quotes (single quotes or double
                        quotes, whichever you like, as long as they are
                        consistent) around your strings
                    </li>
                    <li>
                        you forgot to "import random" before you use functions
                        in the random library
                    </li>
                </ul>
            </Accordion>

            <Accordion
                title="ZeroDivisionError: `division by zero`"
                sectionId="error-division-by-zero"
                pageId={props.pageId}
                click={(next: string) => {
                    props.onSectionChange(current, next);
                    setCurrent(next);
                }}
                current={current}
            >
                <b>This may be because:</b>
                <ul>
                    <li>you tried to divide a number by zero</li>
                    <li>
                        you tried to divide a number by a variable, which
                        happened to be zero
                    </li>
                </ul>
            </Accordion>

            <Accordion
                title="IndexError: `list index out of range`"
                sectionId="error-index-out-of-range"
                pageId={props.pageId}
                click={(next: string) => {
                    props.onSectionChange(current, next);
                    setCurrent(next);
                }}
                current={current}
            >
                <b>This may be because:</b>

                <ul>
                    <li>
                        you tried to access a non-existent element in a list
                    </li>
                    <li>
                        <b>Be careful</b>: list indices start with{" "}
                        <Code>0</Code> in Python.
                    </li>
                    <li>
                        to access the first element of a list of five items, use
                        index <Code>0</Code>
                    </li>
                    <li>
                        to access the last element of a list of five items, use
                        index <Code>4</Code>
                    </li>
                </ul>
            </Accordion>
        </Fragment>
    );
};
