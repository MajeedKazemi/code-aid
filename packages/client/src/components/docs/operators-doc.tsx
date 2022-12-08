import { Fragment, useState } from "react";

import { Accordion } from "../accordion";
import { Example } from "../doc-example";
import { Code } from "../doc-inline-code";
import { Message } from "../doc-message";
import { IDocPageProps } from "./types";

export const OperatorsDoc = (props: IDocPageProps) => {
    const [current, setCurrent] = useState("");

    return (
        <Fragment>
            <h1 className="doc-title">Basic Operators:</h1>
            <h2 className="doc-subtitle">Numbers and Text Operators</h2>

            <Accordion
                title="Arithmetic operations on numbers: `+`, `-`, `*`, `/`, `%`"
                sectionId="arithmetic-operators"
                pageId={props.pageId}
                click={(next: string) => {
                    props.onSectionChange(current, next);
                    setCurrent(next);
                }}
                current={current}
            >
                <p>
                    Numbers of different types can be used in arithmetic
                    operations
                </p>
                <ul>
                    <li>
                        <b>addition</b> using <Code>+</Code> sign: for example{" "}
                        <Code>5 + 2</Code> results in the number <Code>7</Code>
                    </li>
                    <li>
                        <b>subtraction</b> using <Code>-</Code> sign: for
                        example <Code>5 - 2</Code> results in the number{" "}
                        <Code>3</Code>
                    </li>
                    <li>
                        <b>multiplication</b> using <Code>*</Code> sign: for
                        example <Code>5 * 2</Code> results in the number{" "}
                        <Code>10</Code>
                    </li>
                    <li>
                        <b>division</b> using <Code>/</Code> sign: calculates
                        the division result of the two numbers. For example{" "}
                        <Code>5 / 2</Code> results in the float number{" "}
                        <Code>2.5</Code>. See how the division with{" "}
                        <Code>/</Code> results in a float number (with a decimal
                        point)
                    </li>
                    <li>
                        <b>floor division</b> using <Code>//</Code> sign:
                        calculates the division result without the numbers after
                        the decimal point. For example <Code>5 // 2</Code>{" "}
                        results in <Code>2</Code> as a whole number (int or
                        integer)
                    </li>
                    <li>
                        <b>modulus</b> using <Code>%</Code> sign: calculates the{" "}
                        <b>remainder</b> of the division. For example{" "}
                        <Code>5 % 2</Code> will result in the remained of
                        dividing 5 by 2 which. Although the division result will
                        be 2, the remained of this division will be 1.
                        Therefore, <Code>5 % 2</Code> results in 1
                    </li>
                    <li>
                        <b>exponent</b> using <Code>**</Code> sign: calculates
                        the left value raised to the power of the right value.
                        For example <Code>5 ** 2</Code> means <Code>5 * 5</Code>{" "}
                        and <Code>5 ** 3</Code> means <Code>5 * 5 * 5</Code>
                    </li>
                </ul>
                <Example
                    code={[
                        `print(5 + 2) # will display: 7`,
                        `print(5 - 2) # will display: 3`,
                        `print(5 * 2) # will display 10`,
                        `print(5 / 2) # will display 2.5`,
                        `print(5 // 2) # will display 2`,
                        `print(5 % 2) # will display 1`,
                        `print(5 ** 2) # will display 25`,
                    ].join("\n")}
                ></Example>
            </Accordion>

            <Accordion
                title="Adding a value to the previous value of a variable using `+=`"
                sectionId="add-value-plus-equals"
                pageId={props.pageId}
                click={(next: string) => {
                    props.onSectionChange(current, next);
                    setCurrent(next);
                }}
                current={current}
            >
                <ul>
                    <li>
                        Sometimes we need to add a value to the previous value
                        of a variable.
                    </li>
                    <li>This could be done like the following examples:</li>
                </ul>
                <Example
                    code={[
                        `x = 0       # set x to 0`,
                        `x = x + 2   # add 2 to the previous value of x (0) and then set it to x`,
                        `x = x + 3   # add 3 to the previous value of x (2) and then set it to x`,
                        `print(x)    # will display: 5`,
                    ].join("\n")}
                ></Example>
                <ul>
                    <li>
                        This could be simplified using the <Code>+=</Code>{" "}
                        operator as shown in the following example:
                    </li>
                </ul>
                <Example
                    code={[
                        `x = 0       # set x to 0`,
                        `x += 2   # add 2 to the previous value of x (0) and then set it to x`,
                        `x += 3   # add 3 to the previous value of x (2) and then set it to x`,
                        `print(x)    # will display: 5`,
                    ].join("\n")}
                ></Example>

                <ul>
                    <li>
                        The <Code>+=</Code> operator could also be used on
                        strings to join a new string to the end of a variable
                    </li>
                </ul>
                <Example
                    code={[
                        `msg = ""`,
                        `msg += "hello"`,
                        `msg += " to "`,
                        `msg += " the "`,
                        `msg += "world"`,
                        `print(msg)   # will display: hello to the world`,
                    ].join("\n")}
                ></Example>
                <Message>
                    Note that you will receive an error if you try to access a
                    variable before it is defined
                </Message>
                <Example
                    isError
                    code={`msg += "hello"   # error: msg is not defined`}
                ></Example>

                <Example
                    code={[
                        `msg = ""`,
                        `msg += "hello"   # correctly adds "hello" to the end of an empty message`,
                    ].join("\n")}
                ></Example>
            </Accordion>

            <Accordion
                title="Shortcut operators to update a variable: `+=`, `-=`, `*=`, and `/=`"
                sectionId="assignment-operators"
                pageId={props.pageId}
                click={(next: string) => {
                    props.onSectionChange(current, next);
                    setCurrent(next);
                }}
                current={current}
            >
                <p>
                    Assignment operators are used to assign values to variables:
                </p>
                <p>
                    Similar to += that adds the value on the right to the
                    previous value of the variable on the left, the following
                    operators do the same with subtraction, division, and
                    multiplication:
                </p>
                <ul>
                    <li>
                        <Code>var += value</Code> is equal to{" "}
                        <Code>var = var + value</Code>
                    </li>
                    <li>
                        <Code>var -= value</Code> is equal to{" "}
                        <Code>var = var - value</Code>
                    </li>
                    <li>
                        <Code>var /= value</Code> is equal to{" "}
                        <Code>var = var / value</Code>
                    </li>
                    <li>
                        <Code>var *= value</Code> is equal to{" "}
                        <Code>var = var * value</Code>
                    </li>
                </ul>
                <Message>
                    The <Code>+=</Code> works both on <Code>str</Code> and{" "}
                    <Code>int</Code> type of variables. For strings, it will
                    join the new text and for integers, it will add the new
                    number to the variable.
                </Message>
            </Accordion>

            <Accordion
                title="Using the `+` operator to join strings (texts) together"
                sectionId="join-strings-using-plus"
                pageId={props.pageId}
                click={(next: string) => {
                    props.onSectionChange(current, next);
                    setCurrent(next);
                }}
                current={current}
            >
                <p>
                    The plus operator + could be used to join the characters of
                    two strings (texts) together. For example{" "}
                    <Code>"hello" + "world"</Code> becomes{" "}
                    <Code>"helloworld"</Code> and{" "}
                    <Code>"hello" + " " + "world"</Code> becomes{" "}
                    <Code>"hello world"</Code>.
                </p>
                <p>
                    Note that this will only work if both of the values to the
                    left and right of the + operator are strings. For example{" "}
                    <Code>"I am " + 15 + " years old"</Code> is not able to
                    execute as the <Code>15</Code> is not a string. In these
                    situations, Python will display the following error message:{" "}
                    <b>TypeError: can only concatenate str (not "int")</b> to
                    str
                </p>

                <Example
                    isError
                    code={[
                        `msg = "hello " + 2 + " world" # will throw an error`,
                        `print(msg)   # will not run because of the error in the previous line`,
                    ].join("\n")}
                ></Example>
                <Message>
                    To fix this, we can use the <Code>str( )</Code> operator.
                </Message>
                <p>
                    The value that is inside the parenthesis of the{" "}
                    <Code>str( value )</Code> operator will be converted to it's
                    textual value. See the examples below that converts the
                    number <Code>2</Code> to the character <Code>"2"</Code>:
                </p>
                <Example
                    code={[
                        `msg = "hello " + str(2) + " world"`,
                        `print(msg)   # will display: hello 2 world`,
                    ].join("\n")}
                ></Example>
            </Accordion>

            <Accordion
                title="Using the `+` operator to add two Integers (numbers)"
                sectionId="join-integers-using-plus"
                pageId={props.pageId}
                click={(next: string) => {
                    props.onSectionChange(current, next);
                    setCurrent(next);
                }}
                current={current}
            >
                <p>
                    If the values to the left and right of the <Code>+</Code>{" "}
                    operator are both strings (texts), the <Code>+</Code>{" "}
                    operator will join the characters of the two strings to
                    create a bigger string (text).
                </p>
                <p>
                    However, if the values to the left and right of the{" "}
                    <Code>+</Code> operator are both integers (numbers) it will
                    then perform an arithmetic addition operation.
                </p>

                <Example
                    code={[
                        `msg = 123 + 321`,
                        `print(msg)   # will display: 444`,
                    ].join("\n")}
                ></Example>

                <Example
                    code={[
                        `msg = "123" + "321"`,
                        `print(msg)   # will display: 123321`,
                    ].join("\n")}
                ></Example>
            </Accordion>

            <h2 className="doc-subtitle">Boolean Operators</h2>

            <Accordion
                title="Comparison Operators `==`, `>`, `<`"
                sectionId="comparison-operators"
                pageId={props.pageId}
                click={(next: string) => {
                    props.onSectionChange(current, next);
                    setCurrent(next);
                }}
                current={current}
            >
                <p>Comparison operators are used to compare two values:</p>
                <ul>
                    <li>
                        All comparators check and compare the value on the left
                        with the value on the right of the operator.
                    </li>
                    <li>
                        All comparators either return <Code>True</Code> or{" "}
                        <Code>False</Code> based on their comparison.
                    </li>
                </ul>
                <table>
                    <thead>
                        <tr>
                            <th>Operator</th>
                            <th>Name</th>
                            <th>Example</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <Code>==</Code>
                            </td>
                            <td>Equal</td>
                            <td>
                                <Code>x == y</Code>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <Code>!=</Code>
                            </td>
                            <td>Not equal</td>
                            <td>
                                <Code>x != y</Code>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <Code>{">"}</Code>
                            </td>
                            <td>Greater than</td>
                            <td>
                                <Code>{"x > y"}</Code>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <Code>{"<"}</Code>
                            </td>
                            <td>Less than</td>
                            <td>
                                <Code>{"x < y"}</Code>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <Code>{">="}</Code>
                            </td>
                            <td>Greater than or equal to</td>
                            <td>
                                <Code>{"x >= y"}</Code>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <Code>{"<="}</Code>
                            </td>
                            <td>Less than or equal</td>
                            <td>
                                <Code>{"x <= y"}</Code>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </Accordion>

            <Accordion
                title="`<=` (less than or equal to)"
                sectionId="compare-lte"
                pageId={props.pageId}
                click={(next: string) => {
                    props.onSectionChange(current, next);
                    setCurrent(next);
                }}
                current={current}
            >
                <p>Compares two values. </p>
                <p>
                    Returns <Code>True</Code> if the left value is less than or
                    equal to the right value.
                </p>
                <Example code={`print(1 <= 1) #outputs True`}></Example>
                <Example
                    code={`if(3 <= 5):\n\tprint("hello world") #outputs hello world`}
                ></Example>
            </Accordion>

            <Accordion
                title="`>=` (greater than or equal to)"
                sectionId="compare-gte"
                pageId={props.pageId}
                click={(next: string) => {
                    props.onSectionChange(current, next);
                    setCurrent(next);
                }}
                current={current}
            >
                <p>Compares two values. </p>
                <p>
                    Returns <Code>True</Code> if the left value is greater than
                    or equal to the right value.
                </p>
                <Example code={`print(1 >= 1) #outputs True`}></Example>
                <Example
                    code={`if(3 >= 2):\n\tprint("hello world") #outputs hello world`}
                ></Example>
            </Accordion>

            <Accordion
                title="Logical Operators: `and`, `or`, and `not`"
                sectionId="logical-operators"
                pageId={props.pageId}
                click={(next: string) => {
                    props.onSectionChange(current, next);
                    setCurrent(next);
                }}
                current={current}
            >
                <p>
                    Logical operators are used to combine conditional
                    statements:
                </p>
                <table>
                    <thead>
                        <tr>
                            <th>Operator</th>
                            <th>Description</th>
                            <th>Example</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <Code>and</Code>
                            </td>
                            <td>
                                Returns <Code>True</Code> if both statements are
                                <Code>True</Code>
                            </td>
                            <td>
                                <Code>{"x < 5 and x < 10"}</Code>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <Code>or</Code>
                            </td>
                            <td>
                                Returns <Code>True</Code> if one of the
                                statements is <Code>True</Code>
                            </td>
                            <td>
                                <Code>{"x < 5 or x < 4"}</Code>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <Code>not</Code>
                            </td>
                            <td>
                                Reverse the result, returns <Code>False</Code>{" "}
                                if the result is <Code>True</Code>
                            </td>
                            <td>
                                <Code>{"not(x < 5 and x < 10)"}</Code>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </Accordion>

            <Accordion
                title="Python Membership Operators"
                sectionId="membership-operators"
                pageId={props.pageId}
                click={(next: string) => {
                    props.onSectionChange(current, next);
                    setCurrent(next);
                }}
                current={current}
            >
                <p>
                    Membership operators are used to test if a sequence is
                    presented in an object:
                </p>
                <table>
                    <thead>
                        <tr>
                            <th>Operator</th>
                            <th>Description</th>
                            <th>Example</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <Code>in</Code>
                            </td>
                            <td>
                                Returns <Code>True</Code> if a sequence with the
                                specified value is present in the object
                            </td>
                            <td>
                                <Code>{"x in y"}</Code>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <Code>not in</Code>
                            </td>
                            <td>
                                Returns <Code>True</Code> if a sequence with the
                                specified value is not present in the object
                            </td>
                            <td>
                                <Code>{"x not in y"}</Code>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </Accordion>
        </Fragment>
    );
};
