import { Fragment, useState } from "react";

import { Accordion } from "../accordion";
import { Example } from "../doc-example";
import { Code } from "../doc-inline-code";
import { Message } from "../doc-message";
import { IDocPageProps } from "./types";

export const InputOutputDoc = (props: IDocPageProps) => {
    const [current, setCurrent] = useState("");

    return (
        <Fragment>
            <h1 className="doc-title">Input and Output:</h1>
            <Accordion
                title="Display messages using `print(  )`"
                sectionId="display-messages-print"
                pageId={props.pageId}
                click={(next: string) => {
                    props.onSectionChange(current, next);
                    setCurrent(next);
                }}
                current={current}
            >
                <p>
                    When this statement gets executed, it will display a message
                    in the output.
                </p>
                <ul>
                    <li>
                        The message is determined by the value inside the
                        parenthesis.
                    </li>
                    <li>
                        For example the value inside the parenthesis can be a
                        fixed text like this: <Code>"this is my message"</Code>
                    </li>
                    <li>
                        <b>Strings:</b> these fixed messages that include a
                        double quote <Code>"</Code> <Code>"</Code> *before* and
                        *after* them are called strings. Strings are just a
                        series of characters. See the example below:
                    </li>
                </ul>
                <Example
                    code={`print("this is my message") # will display: this is my message`}
                    text="Displays the fixed message in the output console"
                ></Example>
                <ul>
                    <li>
                        <Code>print</Code> can receive multiple values separated
                        by a , (comma) and the output will display them after
                        each other like below:
                    </li>
                </ul>

                <Example
                    code={`print("hello", 2, "the world") # will display: hello 2 the world`}
                    text="Display multiple values separated by a comma"
                ></Example>
                <ul>
                    <li>
                        When displaying multiple values separated by a comma,
                        they could have different types. One could be a fixed
                        message (string), another could be a number (integer),
                        and etc.
                    </li>
                </ul>
                <Message>
                    The print function always adds a new line at the end of the
                    message that it displays.
                </Message>
            </Accordion>

            <Accordion
                title="Ask user input using `input(  )`"
                sectionId="ask-user-input"
                pageId={props.pageId}
                click={(next: string) => {
                    props.onSectionChange(current, next);
                    setCurrent(next);
                }}
                current={current}
            >
                <p>
                    The input will perform <b>three</b> operations:
                </p>
                <ol>
                    <li>
                        Displays a message in the output (determined by the text
                        inside the parenthesis).
                    </li>
                    <li>
                        Waits for the user to enter a message in the console.
                    </li>
                    <li>
                        Reads the message entered by the user and returns it.
                    </li>
                </ol>

                <Message>
                    Input returns a message in the form of a string (text)
                </Message>
                <Example
                    code={[
                        `my_var = input("enter something: ")`,
                        `print(my_var) # will display what the user has entered`,
                    ].join("\n")}
                    text="Asks the user to enter a message, stores it into a variable, and displays the value in the output"
                ></Example>
                <p>
                    the <Code>input( )</Code> function, returns a{" "}
                    <Code>string</Code> (sequence of characters) and therefore
                    could be used as an expression. See the example below:
                </p>
                <Example
                    code={[
                        `print("hello " + input("what's your name?") + "!")`,
                        `# first displays: what's your name?`,
                        `# then waits for the user to enter some text`,
                        `# let's say the user would enter John`,
                        `# then it will display: hello John!`,
                    ].join("\n")}
                    text="Asks the user to enter a message, stores it into a variable, and displays the value in the output"
                ></Example>
                <Message>
                    Python stops executing when it comes to the{" "}
                    <Code>input( )</Code> function, and continues when the user
                    has given some input.
                </Message>
                <Message>
                    The <Code>input( )</Code> function returns a{" "}
                    <Code>string</Code> (sequence of characters). Therefore,
                    when we want to ask for <b>numbers</b>, we have to convert
                    it to an integer using the <Code>int( )</Code> operator.
                </Message>
                <Example
                    code={[
                        `x = int(input("enter a number: "))`,
                        `print(x * 2)`,
                    ].join("\n")}
                    text="Asks the user to enter a number, converts the string value to an integer, then displays the multiplication of the number by 2"
                ></Example>
            </Accordion>
        </Fragment>
    );
};
