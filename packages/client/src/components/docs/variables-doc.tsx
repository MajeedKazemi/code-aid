import { Fragment, useState } from "react";

import { Accordion } from "../accordion";
import { Example } from "../doc-example";
import { Code } from "../doc-inline-code";
import { Message } from "../doc-message";
import { IDocPageProps } from "./types";

export const VariablesDoc = (props: IDocPageProps) => {
    const [current, setCurrent] = useState("");

    return (
        <Fragment>
            <h1 className="doc-title">Variables:</h1>

            <Accordion
                title="Variable Basics"
                sectionId="variable-basics"
                pageId={props.pageId}
                click={(next: string) => {
                    props.onSectionChange(current, next);
                    setCurrent(next);
                }}
                current={current}
            >
                <p>
                    Variables are like a container that store values in the
                    computer memory and their value can be reassigned to be
                    updated.
                </p>
                <p>
                    Python has <u>no</u> command for declaring a variable and a
                    variable is created the moment you first set a value to it.
                    See the example below:
                </p>
                <Example
                    code={'x = 5\ny = "John"\nprint(x)\nprint(y)'}
                ></Example>
                <ul>
                    <li>
                        Each variable has a <b>unique</b> name (called an
                        identifier)
                    </li>
                    <li>
                        You can set the value of a variable using the{" "}
                        <Code>=</Code> operator.
                    </li>
                    <li>
                        For example <Code>x = 10</Code> creates a variable
                        called x and sets its value to a fixed number (integer).
                    </li>
                    <li>
                        For example <Code>message = "some message"</Code>{" "}
                        creates a variable called message and sets it to a fixed
                        text (string).
                    </li>
                    <li>
                        Variables can only be accessed (to get their value){" "}
                        <b>after</b> they've been assigned a value, otherwise
                        the program is not able to recognize the variable. See
                        and compare the examples below:
                    </li>
                </ul>
                <Example
                    isError
                    title="Invalid"
                    text="Error: Variable accessed before being assigned a value"
                    code={[
                        `print(var) # throws an error as var needs to be defined before it is accessed`,
                        `var = "some text"`,
                    ].join("\n")}
                ></Example>

                <Example
                    title="Valid"
                    text="This is a valid example of accessing the value of the variable var as it is first assigned a value and then accessed on the next line."
                    code={[
                        `var = "some text"`,
                        `print(var) # will display: some text`,
                    ].join("\n")}
                ></Example>
            </Accordion>

            <Accordion
                title="Variable Names"
                sectionId="var-names-intro"
                pageId={props.pageId}
                click={(next: string) => {
                    props.onSectionChange(current, next);
                    setCurrent(next);
                }}
                current={current}
            >
                <p>
                    A variable can have a short name (like x and y) or a more
                    descriptive name (age, carname, total_volume). Rules for
                    Python variables:
                </p>
                <ul>
                    <li>
                        A variable name must start with a letter or the
                        underscore character
                    </li>
                    <li>A variable name cannot start with a number</li>
                    <li>
                        A variable name can only contain alpha-numeric
                        characters and underscores (A-z, 0-9, and _ )
                    </li>
                    <li>
                        Variable names are case-sensitive (age, Age and AGE are
                        three different variables)
                    </li>
                </ul>
                <Example
                    code={
                        'myvar = "John"\nmy_var = "John"\n_my_var = "John"\nmyVar = "John"\nMYVAR = "John"\nmyvar2 = "John"'
                    }
                    text="Legal variable names:"
                ></Example>

                <Example
                    code={'2myvar = "John"\nmy-var = "John"\nmy var = "John"'}
                    text="Illegal variable names:"
                    isError
                ></Example>
                <Message>
                    Remember that variable names are case-sensitive
                </Message>
            </Accordion>

            <Accordion
                title="Variable Name Standards"
                sectionId="var-name-standards"
                pageId={props.pageId}
                click={(next: string) => {
                    props.onSectionChange(current, next);
                    setCurrent(next);
                }}
                current={current}
            >
                <p>
                    Variable names with more than one word can be difficult to
                    read.
                </p>
                <p>
                    There are several techniques you can use to make them more
                    readable:
                </p>

                <h2>Snake Case</h2>
                <Example
                    code={'my_variable_name = "John"'}
                    text="Each word is separated by an underscore character:"
                ></Example>

                <h2>Camel Case</h2>
                <Example
                    code={'myVariableName = "John"'}
                    text="Each word, except the first, starts with a capital letter:"
                ></Example>

                <h2>Pascal Case</h2>
                <Example
                    code={'MyVariableName = "John"'}
                    text="Each word starts with a capital letter:"
                ></Example>
            </Accordion>

            <Accordion
                title="Accessing value of a variable"
                sectionId="access-value-vars"
                pageId={props.pageId}
                click={(next: string) => {
                    props.onSectionChange(current, next);
                    setCurrent(next);
                }}
                current={current}
            >
                <p>
                    Variable names are case sensitive. So when accessing them,
                    they should be exactly the same.
                </p>

                <Example
                    code={[
                        `my_var = "john"`,
                        `MY_VAR = "doe"`,
                        ``,
                        `print(my_var) # will display: john`,
                        `print(MY_VAR) # will display: doe`,
                    ].join("\n")}
                    text="Each word is separated by an underscore character:"
                ></Example>
            </Accordion>

            <Accordion
                title="Multiple assignments in one line"
                sectionId="multi-assign-vars"
                pageId={props.pageId}
                click={(next: string) => {
                    props.onSectionChange(current, next);
                    setCurrent(next);
                }}
                current={current}
            >
                <p>
                    In python you can use the comma operator to assign multiple
                    values to multiple variables
                </p>

                <Example
                    code={[
                        `a, b, c = “hello”, 10, False`,
                        ``,
                        `# the code above is the same as below:`,
                        ``,
                        `a = “hello”`,
                        `b = 10`,
                        `c = False`,
                    ].join("\n")}
                ></Example>
            </Accordion>
        </Fragment>
    );
};
