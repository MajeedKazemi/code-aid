import { Fragment, useState } from "react";

import { Accordion } from "../accordion";
import { Example } from "../doc-example";
import { Code } from "../doc-inline-code";
import { Message } from "../doc-message";
import { IDocPageProps } from "./types";

export const ConditionalsDoc = (props: IDocPageProps) => {
    const [current, setCurrent] = useState("");

    return (
        <Fragment>
            <h1 className="doc-title">Conditionals</h1>
            <Accordion
                title="`if` Statement"
                sectionId="if-statement"
                pageId={props.pageId}
                click={(next: string) => {
                    props.onSectionChange(current, next);
                    setCurrent(next);
                }}
                current={current}
            >
                <p>
                    Will only execute the indented block of code below it when
                    the condition is true.
                </p>

                <Example
                    text={
                        'In the following code, as a<10, the program outputs "Success".'
                    }
                    code={`a = 3\nif a < 10:\n\tprint(\"Success!\")`}
                ></Example>
                <Example
                    text={
                        "In the following code, as a is NOT greater than 10, the program does not execute the print command."
                    }
                    code={`a = 3\nif a > 10:\n\tprint(\"Success!\")`}
                ></Example>
            </Accordion>

            <Accordion
                title="`elif` Statement"
                sectionId="elif-statement"
                pageId={props.pageId}
                click={(next: string) => {
                    props.onSectionChange(current, next);
                    setCurrent(next);
                }}
                current={current}
            >
                <p>
                    Short for else-if; adds another case to an existing if
                    statement. The `elif` will only run when previous `if` or
                    `elif` statement is false
                </p>

                <Example
                    text={
                        "In the following code, as a<10, the program executes the second print command."
                    }
                    code={`a = 3\nif a > 10:\n\tprint(\"a is larger than 10\")\nelif a < 10:\n\tprint(\"a is smaller than 10\")`}
                ></Example>
                <Example
                    text={
                        "In the following code, as a>3, the program executes the first print command and ignores all other elif's nested within this if-statement."
                    }
                    code={`a = 5\nif a > 3:\n\tprint(3)\nelif a > 4:\n\tprint(4)\nelif a == 5:\n\tprint(5)\nelif a > 6:\n\tprint(6)`}
                ></Example>
            </Accordion>

            <Accordion
                title="`else` Statement"
                sectionId="else-statement"
                pageId={props.pageId}
                click={(next: string) => {
                    props.onSectionChange(current, next);
                    setCurrent(next);
                }}
                current={current}
            >
                <p>
                    Can be used after an if or an elif statement. will execute
                    its block of code when the if and the elif statements were
                    not true
                </p>

                <Example
                    text={
                        'Since none of the comparisons are True, the statement at "else" is executed'
                    }
                    code={`a = 2\nif a > 3:\n\tprint(3)\nelif a > 4:\n\tprint(4)\nelif a == 5:\n\tprint(5)\nelif a > 6:\n\tprint(6)\nelse:\n\tprint(\"None of the above are true.\")`}
                ></Example>

                <Message>
                    Pay attention that <Code>else</Code> does not have a
                    condition, but <Code>elif</Code> requires a condition.
                </Message>
            </Accordion>

            <Accordion
                title="Nested If"
                sectionId="nested-if"
                pageId={props.pageId}
                click={(next: string) => {
                    props.onSectionChange(current, next);
                    setCurrent(next);
                }}
                current={current}
            >
                <p>
                    You can have <Code>if</Code> statements inside{" "}
                    <Code>if</Code> statements, this is called nested{" "}
                    <Code>if</Code> statements.
                </p>
                <Example
                    code={
                        'x = 41\n\nif x > 10:\n\tprint("Above ten,")\n\tif x > 20:\n\t\tprint("and also above 20!")\n\telse:\n\t\tprint("but not above 20.")'
                    }
                ></Example>
            </Accordion>

            <Accordion
                title="The `pass` Statement"
                sectionId="pass-statement"
                pageId={props.pageId}
                click={(next: string) => {
                    props.onSectionChange(current, next);
                    setCurrent(next);
                }}
                current={current}
            >
                <p>
                    <Code>if</Code> statements cannot be empty, but if you for
                    some reason have an <Code>if</Code> statement with no
                    content, put in the <Code>pass</Code> statement to avoid
                    getting an error.
                </p>
                <Example
                    code={"a = 33\nb = 200\n\nif b > a:\n\tpass"}
                ></Example>
            </Accordion>
        </Fragment>
    );
};
