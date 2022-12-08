import { Fragment, useState } from "react";

import { Accordion } from "../accordion";
import { Example } from "../doc-example";
import { Code } from "../doc-inline-code";
import { Message } from "../doc-message";
import { IDocPageProps } from "./types";

export const IndentationsDoc = (props: IDocPageProps) => {
    const [current, setCurrent] = useState("");

    return (
        <Fragment>
            <h1 className="doc-title">Python Statements and Indentations:</h1>

            <Accordion
                title="Python statements"
                sectionId="python-statements"
                pageId={props.pageId}
                click={(next: string) => {
                    props.onSectionChange(current, next);
                    setCurrent(next);
                }}
                current={current}
            >
                <p>
                    Python programs are a series of statements. For example both{" "}
                    <Code>a = 10</Code> and <Code>print("Hello World")</Code>{" "}
                    are statements.
                </p>
                <p>
                    it is more conventional to write each statement in one line
                </p>

                <Example
                    text="two statements in a line separated by a semicolon (;)"
                    code={[`print("hello"); print("world")`].join("\n")}
                ></Example>

                <p>the above code is the same as the one below:</p>
                <Example
                    code={[`print("hello")`, `print("world")`].join("\n")}
                ></Example>
            </Accordion>

            <Accordion
                title="Indentations and Code Blocks"
                sectionId="python-indentations"
                pageId={props.pageId}
                click={(next: string) => {
                    props.onSectionChange(current, next);
                    setCurrent(next);
                }}
                current={current}
            >
                <p>
                    Indentation refers to the number of spaces at the beginning
                    of a code line.{" "}
                </p>
                <ul>
                    <li>The indentation is very important in python.</li>
                    <li>
                        A block of code is a series of statements that all have
                        the same indentation. The two print statements after the
                        if conditional <Code>print("5 {">"} 2")</Code> and{" "}
                        <Code>print("if block")</Code> are in a separate block
                        and will only run if the condition of the if statement
                        becomes True.
                    </li>
                </ul>
                <Example
                    code={[
                        `print("main block")`,
                        ``,
                        `if 5 > 2:`,
                        `    print("5 > 2")`,
                        `    print("if block")`,
                        ``,
                        `print("main block")`,
                    ].join("\n")}
                ></Example>
                <ul>
                    <li>
                        in the above example the first and last{" "}
                        <Code>print("main block")</Code> are both inside the
                        same block as they have the same indentation. Similarly,
                        the two prints inside the if statement (
                        <Code>print("5 {">"} 2"</Code>) and{" "}
                        <Code>print("if block")</Code>) are in also in another
                        code block (different than the main block).
                    </li>
                    <li>
                        the number of spaces before each of line code should be
                        the same in each block See and compare the following
                        examples:
                    </li>
                </ul>

                <Example
                    code={[
                        `print("main block")`,
                        ` print("extra space before print()") # will throw an error`,
                    ].join("\n")}
                    text="Two lines of code (in the same block) with different indentation (will raise an error)"
                    isError
                ></Example>

                <Example
                    code={[
                        `if 5 > 2:`,
                        `   print("5 > 2")`,
                        `      print("extra indentation before print()") # will throw an error`,
                    ].join("\n")}
                    text="Two lines of code (in the same block) with different indentation (will raise an error)"
                    isError
                ></Example>

                <Example
                    code={
                        'a = 33\nb = 200\nif b > a:\nprint("b is greater than a") # you will get an error'
                    }
                    text="If statement, without indentation (will raise an error):"
                    isError
                ></Example>

                <Message>
                    including 4 spaces for each level of indentation is just a
                    standard used by many. You could actually just have 1 space
                    for all the statements in that block, and the code will be
                    fine.
                </Message>
            </Accordion>
        </Fragment>
    );
};
