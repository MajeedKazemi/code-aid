import { Fragment, useState } from "react";

import { Accordion } from "../accordion";
import { Example } from "../doc-example";
import { Code } from "../doc-inline-code";
import { Message } from "../doc-message";
import { IDocPageProps } from "./types";

export const DataTypesDoc = (props: IDocPageProps) => {
    const [current, setCurrent] = useState("");

    return (
        <Fragment>
            <h1 className="doc-title">Data Types:</h1>

            <Accordion
                title="Intro To Data Types"
                sectionId="intro-data-types"
                pageId={props.pageId}
                click={(next: string) => {
                    props.onSectionChange(current, next);
                    setCurrent(next);
                }}
                current={current}
            >
                <p>In programming, data type is an important concept.</p>
                <p>
                    Variables can store data of different types, and different
                    types can do different things.
                </p>
                <p>
                    Python has many different data types. Below are a list of
                    some of the more common data types.
                </p>

                <ul>
                    <li>
                        <b>Text (String)</b>: variables that hold textual values
                        (a series of characters). For example both of these
                        variables <Code>x = "hello world"</Code> and{" "}
                        <Code>y = "30"</Code> hold textual values as they are
                        set to a fixed text (that starts and ends with a double
                        quote <Code>"</Code> <Code>"</Code>).
                    </li>
                    <br />
                    <li>
                        <b>Number (Integer and Float)</b>: variables that hold
                        numeric values to be used in arithmetic operations. For
                        example <Code>x = 30</Code> and <Code>y = 0.5</Code> are
                        both numeric values.
                        <ul>
                            <li>
                                Integers are whole numbers. Such as{" "}
                                <Code>x = 10</Code>
                            </li>
                            <li>
                                Floats are numbers with decimals. Such as{" "}
                                <Code>x = 2.5</Code>
                            </li>
                        </ul>
                    </li>
                    <br />
                    <li>
                        <b>List</b>: allow storing multiple values as a list.
                        For example <Code>x = [5, 10, 15, 20, 25]</Code> we set
                        the variable x to a list of 5 numbers.
                        <ul>
                            <li>
                                Lists are ordered and each element inside them
                                can be accessed by an index.
                            </li>
                            <li>
                                For example <Code>x[0]</Code> is how we access
                                the first item in the list (which in this case
                                equals to 5) or <Code>x[1]</Code> will access
                                the second item in the list.{" "}
                            </li>
                            <li>
                                The length of a list can be retrieved using the{" "}
                                <Code>len( )</Code> function. So for example,{" "}
                                <Code>len(x)</Code> equals to 5.
                            </li>
                        </ul>
                    </li>
                    <br />
                    <li>
                        <b>Boolean</b>: can either hold <Code>True</Code> or{" "}
                        <Code>False</Code>.
                    </li>
                </ul>
            </Accordion>

            <Accordion
                title="Textual Values `str` (Sequences of Characters)"
                sectionId="string-types"
                pageId={props.pageId}
                click={(next: string) => {
                    props.onSectionChange(current, next);
                    setCurrent(next);
                }}
                current={current}
            >
                <p>
                    In Python, a string (or str) is a set of characters
                    represented in quotation marks ". So in the statement
                    <Code>print("Hello World!")</Code> the print function
                    displays the string <Code>"Hello World!"</Code>.
                </p>
                <p>
                    In fact we are able to access each character inside strings
                    similar to how we access elements inside a list using the{" "}
                    <Code>[ ]</Code> operator. For example{" "}
                    <Code>"hello"[0]</Code> is <Code>"h"</Code>.
                </p>
                <p>
                    The length of a string can be determined using the{" "}
                    <Code>len( )</Code> function.
                </p>
                <p>
                    Single quotes <Code>'</Code> or double quotes <Code>"</Code>{" "}
                    do not matter, as long as you are <b>consistent</b> with it.
                </p>

                <ul>
                    <li>
                        Using <b>double</b> quotes:{" "}
                        <Code>"This is a String"</Code>
                    </li>
                    <li>
                        Using <b>single</b> quotes:{" "}
                        <Code>'This is also a string'</Code>
                    </li>
                </ul>

                <Example
                    code={[
                        `x = "hello" # set x to a string (using double quotes)`,
                        `y = 'world' # set y to a string (using single quotes)`,
                        `print(x) # will display: hello`,
                        `print(y) # will display: world`,
                    ].join("\n")}
                ></Example>
            </Accordion>

            <Accordion
                title="Number Variables (`int` and `float`)"
                sectionId="integer-types"
                pageId={props.pageId}
                click={(next: string) => {
                    props.onSectionChange(current, next);
                    setCurrent(next);
                }}
                current={current}
            >
                <p>
                    There are three numeric types in Python: int, float, complex
                </p>
                <ul>
                    <li>
                        <b>Integers</b> are whole numbers. For example these
                        variables are all integers: <Code>x = 10</Code>,{" "}
                        <Code>x = 2 + 3</Code>, and{" "}
                        <Code>x = random.randint(1, 10)</Code>
                    </li>
                    <li>
                        <b>Floats</b> are numbers with decimal points. For
                        example these variables are all floats:{" "}
                        <Code>y = 10.0</Code>, <Code>y = 0.5</Code>,{" "}
                        <Code>y = 1 / 2</Code>, and <Code>y = 2 + 0.5</Code>
                    </li>
                </ul>

                <Message>Numbers can be positive, negative, or zero.</Message>
                <Message>
                    Note that integers CANNOT contain decimal places.
                </Message>
                <Message>Integers are NOT enclosed in quotation marks.</Message>

                <Example
                    title="z contains the textual character 1 and cannot be used in arithemtic operations"
                    code={`z = "1"   # not a number\nprint(z + 1)   # will throw an error`}
                ></Example>
            </Accordion>

            <Accordion
                title="Floats (Numbers with Decimal Points)"
                sectionId="float-types"
                pageId={props.pageId}
                click={(next: string) => {
                    props.onSectionChange(current, next);
                    setCurrent(next);
                }}
                current={current}
            >
                <ul>
                    <li>Floats are numbers that contain decimal places</li>
                    <li>Floats can be postive, negative, or zero.</li>
                    <li>
                        Floats can also resemble integers (like{" "}
                        <Code>100.0</Code>), but the <Code>.0</Code> decimal
                        place will always be shown explicitly.
                    </li>
                    <li>
                        These are all floats: <Code>x = 3.1415</Code>,{" "}
                        <Code>-1.63</Code>, <Code>0.0</Code>, and{" "}
                        <Code>100.0</Code>
                    </li>
                </ul>

                <Example
                    title="integer division (x // y) compared to float division (x / y) "
                    code={[
                        `x = 100`,
                        `y = 5`,
                        `a = x / y   # a becomes 20.0 (float)`,
                        `b = x // y   # b becomes 20 (integer)`,
                        ,
                    ].join("\n")}
                ></Example>

                <Message>
                    Floats are also NOT enclosed in quotation marks.
                </Message>
            </Accordion>

            <Accordion
                title="Booleans `True` or `False`"
                sectionId="boolean-types"
                pageId={props.pageId}
                click={(next: string) => {
                    props.onSectionChange(current, next);
                    setCurrent(next);
                }}
                current={current}
            >
                <p>
                    Booleans can either be <Code>True</Code> or{" "}
                    <Code>False</Code>
                </p>
                <p>
                    Every comparison you make such as <Code>{"10 < 100"}</Code>{" "}
                    is a Boolean (<Code>{"10 < 100"}</Code> simplifies into{" "}
                    <Code>True</Code>)
                </p>
                <p>
                    In the following example, <Code>is_positive</Code> is
                    initially set to <Code>False</Code> and will only become{" "}
                    <Code>True</Code> when number is greater than 0.
                </p>
                <Example
                    code={[
                        `is_positive = False`,
                        ``,
                        `number = int(input("enter a number: "))`,
                        ``,
                        `if number > 0:`,
                        `    is_positive = True`,
                        ``,
                        `if is_positive:`,
                        `    print("You entered a positive number!")`,
                        `else:`,
                        `    print("You entered a negative number!")`,
                    ].join("\n")}
                ></Example>
            </Accordion>

            <h2 className="doc-subtitle">Useful Tools For Data Types</h2>

            <Accordion
                title="Getting the Data Type of a variable using `type(  )`"
                sectionId="getting-var-type"
                pageId={props.pageId}
                click={(next: string) => {
                    props.onSectionChange(current, next);
                    setCurrent(next);
                }}
                current={current}
            >
                <p>
                    You can get the data type of any object by using the{" "}
                    <Code>type()</Code> function:
                </p>
                <p>
                    This function can be used to print and double-check the type
                    of variables, helping us ensure that a variable has the
                    correct type in the middle of a program.
                </p>
                <Example
                    code={
                        "x = 5\nprint(type(x))   # will display: <class 'int'>\nprint(type([1, 2, 3])) # will display: <class 'list'>"
                    }
                    text="Displays the data type of the variable"
                ></Example>
            </Accordion>

            <Accordion
                title="Setting or changing the type of a variable using `int(  )`, `str(  )`"
                sectionId="setting-var-type"
                pageId={props.pageId}
                click={(next: string) => {
                    props.onSectionChange(current, next);
                    setCurrent(next);
                }}
                current={current}
            >
                <Message>
                    Sometimes we need to explicitly specify the data type of a
                    variable.
                </Message>
                <p>
                    In Python, you can convert between data types by using the
                    following functions
                </p>
                <table>
                    <thead>
                        <tr>
                            <th>Function</th>
                            <th>What It Does</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <Code>str( )</Code>
                            </td>
                            <td>Converts the chosen data type to a string</td>
                        </tr>
                        <tr>
                            <td>
                                <Code>int( )</Code>
                            </td>
                            <td>Converts the chosen data type to a integer</td>
                        </tr>
                        <tr>
                            <td>
                                <Code>float( )</Code>
                            </td>
                            <td>Converts the chosen data type to a float</td>
                        </tr>
                    </tbody>
                </table>
                <Example
                    code={"str(5)"}
                    text={"Returns the integer 5 as a string"}
                ></Example>
                <Example
                    code={'int("10")'}
                    text={`Converts the string "10" to an integer`}
                ></Example>
                <Example
                    code={"float(10)"}
                    text={`Converts the integer 10 to a float of 10.0`}
                ></Example>

                <Example
                    isError
                    code={`x = int("hello") # throws an error as "hello" cannot be converted to a number`}
                    text={`Cannot convert non-numeric characters to a number`}
                ></Example>
            </Accordion>

            <Accordion
                title="Converting a string to an int using `int(  )`"
                sectionId="convert-str-to-int"
                pageId={props.pageId}
                click={(next: string) => {
                    props.onSectionChange(current, next);
                    setCurrent(next);
                }}
                current={current}
            >
                <ul>
                    <li>
                        As mentioned before, strings are a series of characters
                    </li>
                    <li>
                        Sometimes, all the characters of a string are digits
                        from 0 to 9. Like <Code>“2022"</Code> or{" "}
                        <Code>"6476330000"</Code>.
                    </li>
                    <li>
                        In these cases, we are able to extract the numeric value
                        of these strings using the <Code>int( )</Code> function.
                        So for example <Code>int("2022")</Code> becomes{" "}
                        <Code>2022</Code> - an integer (whole number) that could
                        be used in arithmetic operations.
                    </li>
                </ul>

                <Example
                    code={[
                        `msg = "123" + "321"`,
                        `print(msg)   # will display: 123321`,
                    ].join("\n")}
                    text={`The plus operator will act as a join operator when both sides are strings`}
                ></Example>

                <Example
                    code={[
                        `msg = int("123") + int("321")`,
                        `print(msg)   # will display: 444`,
                    ].join("\n")}
                    text={`The plus operator will act as an arithmetic addition when both sides are integers (numbers)`}
                ></Example>
            </Accordion>

            <Accordion
                title="Resetting (re-assigning) the type of a variable"
                sectionId="reassign-type-var"
                pageId={props.pageId}
                click={(next: string) => {
                    props.onSectionChange(current, next);
                    setCurrent(next);
                }}
                current={current}
            >
                <p>
                    The type of Python variables will change if they are set to
                    a value with a different type. See the examples below:
                </p>

                <Example
                    code={[
                        `x = 10 # x is set to a whole number -> type of x is int (integer)`,
                        `print(x) # will display: 10`,
                        ``,
                        `x = "hello" # x is set to a string -> type of x becomes str (string)`,
                        `print(x) # will display: hello`,
                        ``,
                        `x = [1, 3, 5] # x is set to a list -> type of x becomes list`,
                        `print(x) # will display: [1 , 3, 5]`,
                    ].join("\n")}
                    text={`The x variable is set to values with different types in the same program`}
                ></Example>
            </Accordion>
        </Fragment>
    );
};
