import { Fragment, useState } from "react";

import { Accordion } from "../accordion";
import { Example } from "../doc-example";
import { Code } from "../doc-inline-code";
import { IDocPageProps } from "./types";

export const CommentsDoc = (props: IDocPageProps) => {
    const [current, setCurrent] = useState("");

    return (
        <Fragment>
            <h1 className="doc-title">Comments:</h1>

            <Accordion
                title="Python Comments"
                sectionId="python-comments"
                pageId={props.pageId}
                click={(next: string) => {
                    props.onSectionChange(current, next);
                    setCurrent(next);
                }}
                current={current}
            >
                <ul>
                    <li>
                        Comments start with a <Code>#</Code> and any text after
                        it on that line will be a comment
                    </li>
                    <li>
                        Comments can be used to explain Python code, make the
                        code more readable.
                    </li>
                    <li>
                        Comments can also be used to prevent the execution of a
                        line of code when testing code. See the examples below:
                    </li>
                </ul>
                <Example
                    code={[
                        `# the line below will display: this is my message`,
                        `print("this is my message")`,
                        ``,
                        `print("hello world") # this line will display: hello world`,
                    ].join("\n")}
                    text={"Comments in Python:"}
                ></Example>

                <Example
                    code={[
                        `# print("will not run") -> the print is commented and will not run`,
                    ].join("\n")}
                    text={"Commenting a line of code:"}
                ></Example>
            </Accordion>

            <Accordion
                title="Multi Line Comments"
                sectionId="multiline-comments"
                pageId={props.pageId}
                click={(next: string) => {
                    props.onSectionChange(current, next);
                    setCurrent(next);
                }}
                current={current}
            >
                <p>
                    Python does not really have a syntax for multi line
                    comments.
                </p>
                <p>
                    To add a multiline comment you could insert a # for each
                    line:
                </p>
                <Example
                    code={
                        '# This is a comment\n# written in#more than just one line\nprint("Hello, World!")'
                    }
                    text={"Comments in Python:"}
                ></Example>

                <p>
                    Or, not quite as intended, you can use a multiline string.
                </p>
                <p>
                    Since Python will ignore string literals that are not
                    assigned to a variable, you can add a multiline string
                    (triple quotes) in your code, and place your comment inside
                    it:
                </p>
                <Example
                    code={
                        '"""This is a comment\nwritten in\nmore than just one line"""\nprint("Hello, World!")'
                    }
                    text={"Comments in Python:"}
                ></Example>

                <p>
                    As long as the string is not assigned to a variable, Python
                    will read the code, but then ignore it, and you have made a
                    multiline comment.
                </p>
            </Accordion>
        </Fragment>
    );
};
