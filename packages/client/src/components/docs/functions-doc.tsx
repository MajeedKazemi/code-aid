import { Fragment, useState } from "react";

import { Accordion } from "../accordion";
import { Example } from "../doc-example";
import { Code } from "../doc-inline-code";
import { Message } from "../doc-message";
import { IDocPageProps } from "./types";

export const FunctionsDoc = (props: IDocPageProps) => {
    const [current, setCurrent] = useState("");

    return (
        <Fragment>
            <h1 className="doc-title">List of all Python Functions:</h1>

            <h2 className="doc-subtitle">General Functions</h2>
            <Accordion
                title="The `print()` function"
                sectionId="print-function"
                pageId={props.pageId}
                click={(next: string) => {
                    props.onSectionChange(current, next);
                    setCurrent(next);
                }}
                current={current}
            >
                <p>Outputs the textual value to the console</p>
                <Message>
                    <p>
                        Parameters: <Code>print(x)</Code>
                    </p>
                </Message>
                <Example
                    code={`print("Hello World") #outputs Hello World to the console`}
                ></Example>
                <p>
                    To print multiple variables inside the text. You can use{" "}
                    <Code>f''</Code> operator (Formattable Text)
                </p>
                <p>
                    Inside of the <Code>f''</Code> operator, to convert
                    variables to its textual value, use the <Code>{}</Code>{" "}
                    operator
                </p>
                <Example
                    code={`age = 16\nname = "Alex"\nprint(f'My name is {name} and I am {age} years old')\n#outputs My name is Alex and I am 16 years old`}
                ></Example>
            </Accordion>

            <Accordion
                title="the `input()` function"
                sectionId="input-function"
                pageId={props.pageId}
                click={(next: string) => {
                    props.onSectionChange(current, next);
                    setCurrent(next);
                }}
                current={current}
            >
                <p>
                    Displays a message in the console that prompts the user to
                    enter some text.
                </p>
                <p>The entered text will be returned.</p>
                <Message>
                    <p>
                        Parameters: <Code>input("message")</Code>
                    </p>
                </Message>
                <Example
                    text={
                        "Assigns the value inputted by the user to the variable answer."
                    }
                    code={`answer = input("What is your name?") `}
                ></Example>
            </Accordion>

            <Accordion
                title="The `range()` function"
                sectionId="range-function"
                pageId={props.pageId}
                click={(next: string) => {
                    props.onSectionChange(current, next);
                    setCurrent(next);
                }}
                current={current}
            >
                <p>
                    To loop through a set of code a specified number of times,
                    we can use the <Code>range()</Code> function
                </p>
                <p>
                    The <Code>range()</Code> function returns a sequence of
                    numbers, starting from 0 by default, and increments by 1 (by
                    default), and ends at a specified number.
                </p>
                <Message>
                    <p>
                        Parameters: <Code>range(start, stop, step)</Code>
                    </p>
                </Message>
                <Example
                    code={"for x in range(6):\n\tprint(x)"}
                    text="Using the range() function. This program will print the following numbers: 0, 1, 2, 3, 4, and 5."
                ></Example>
                <Message>
                    <p>
                        Note that <Code>range(6)</Code> is not the values of 0
                        to 6, but the values 0 to 5.
                    </p>
                </Message>
                <p>
                    The <Code>range()</Code> function defaults to 0 as a
                    starting value, however it is possible to specify the
                    starting value by adding a parameter:{" "}
                    <Code>range(2, 6)</Code>, which means values from 2 to 6
                    (but not including 6):
                </p>
                <Example
                    code={"for x in range(2, 6):\n\tprint(x)"}
                    text="Using the start parameter:"
                ></Example>
            </Accordion>

            <Accordion
                title="The `len()` function"
                sectionId="len-function"
                pageId={props.pageId}
                click={(next: string) => {
                    props.onSectionChange(current, next);
                    setCurrent(next);
                }}
                current={current}
            >
                <p>
                    Returns the number of items in a list or characters in a
                    string.
                </p>
                <Message>
                    <p>
                        Parameters: <Code>len(list)</Code>
                    </p>
                </Message>
                <Example
                    code={`len(["I", "love", "programming"]) #returns 3`}
                ></Example>
            </Accordion>

            <h2 className="doc-subtitle">Math Functions</h2>
            <Accordion
                title="The `abs()` function"
                sectionId="abs-function"
                pageId={props.pageId}
                click={(next: string) => {
                    props.onSectionChange(current, next);
                    setCurrent(next);
                }}
                current={current}
            >
                <p>Returns the absolute value of a number.</p>
                <Message>
                    <p>
                        Parameters: <Code>abs(number)</Code>
                    </p>
                </Message>
                <Example
                    code={
                        "abs(10) #evaluates to 10\n" +
                        "abs(-15) #evaluates to 15"
                    }
                ></Example>
            </Accordion>

            <Accordion
                title="The `pow()` function"
                sectionId="pow-function"
                pageId={props.pageId}
                click={(next: string) => {
                    props.onSectionChange(current, next);
                    setCurrent(next);
                }}
                current={current}
            >
                <p>Returns a number raised to an exponent.</p>
                <Message>
                    <p>
                        Parameters: <Code>pow(base_number, exponent)</Code>
                    </p>
                </Message>
                <Example
                    code={
                        "pow(a,b) # evaluates to a^b\npow(2,3) # evaluates to 8\npow(3,2) #evaluates to 9"
                    }
                ></Example>
            </Accordion>

            <Accordion
                title="The `round()` function"
                sectionId="round-function"
                pageId={props.pageId}
                click={(next: string) => {
                    props.onSectionChange(current, next);
                    setCurrent(next);
                }}
                current={current}
            >
                <p>Rounds a number to the specified decimals</p>
                <Message>
                    <p>
                        Parameters:{" "}
                        <Code>round(number_to_round, number_of_decimals)</Code>
                    </p>
                </Message>
                <Example
                    code={`round(2.4, 0) # evaluates to 2.0\nround(3.8, 0) # evalutes to 4.0\nround(3.86, 1) #evaluates to 3.9`}
                ></Example>
            </Accordion>

            <Accordion
                title="The `min()` function"
                sectionId="min-function"
                pageId={props.pageId}
                click={(next: string) => {
                    props.onSectionChange(current, next);
                    setCurrent(next);
                }}
                current={current}
            >
                <p>returns the minimum value from a list of numbers</p>
                <Message>
                    <p>
                        Parameters: <Code>min([num1, num2, num3, ...])</Code>
                    </p>
                </Message>
                <Example
                    code={`min([1,4,3,2]) # returns 1\nmin([9,8,7,6]) #returns 6`}
                ></Example>
            </Accordion>

            <Accordion
                title="The `max()` function"
                sectionId="max-function"
                pageId={props.pageId}
                click={(next: string) => {
                    props.onSectionChange(current, next);
                    setCurrent(next);
                }}
                current={current}
            >
                <p>returns the maximum value from a list of numbers</p>
                <Message>
                    <p>
                        Parameters: <Code>max([num1, num2, num3, ...])</Code>
                    </p>
                </Message>
                <Example
                    code={`max([1,4,3,2]) # returns 4\nmin([9,8,7,6]) #returns 9`}
                ></Example>
            </Accordion>

            <h2 className="doc-subtitle">Data Type Functions</h2>
            <Accordion
                title="The `int()` function"
                sectionId="int-casting-function"
                pageId={props.pageId}
                click={(next: string) => {
                    props.onSectionChange(current, next);
                    setCurrent(next);
                }}
                current={current}
            >
                <p>Converts the chosen data type into an integer</p>
                <Message>
                    <p>
                        Parameters: <Code>int(x)</Code>
                    </p>
                </Message>
                <Example
                    code={`int("10") #returns 10 as an integer\nint(1.4) #returns 1 as an integer`}
                ></Example>
            </Accordion>

            <Accordion
                title="The `float()` function"
                sectionId="float-casting-function"
                pageId={props.pageId}
                click={(next: string) => {
                    props.onSectionChange(current, next);
                    setCurrent(next);
                }}
                current={current}
            >
                <p>Converts the chosen data type into a float</p>
                <Message>
                    <p>
                        Parameters: <Code>float(x)</Code>
                    </p>
                </Message>
                <Example
                    code={`float(2) #returns 2.0 as a float\nfloat("3") #returns 3.0 as a float\nfloat("4.2") #returns 4.2 as a float`}
                ></Example>
            </Accordion>

            <Accordion
                title="The `str()` function"
                sectionId="str-casting-function"
                pageId={props.pageId}
                click={(next: string) => {
                    props.onSectionChange(current, next);
                    setCurrent(next);
                }}
                current={current}
            >
                <p>Converts the chosen data type into a string</p>
                <Message>
                    <p>
                        Parameters: <Code>str(x)</Code>
                    </p>
                </Message>
                <Example
                    code={`str(2) #returns "2" as a string\nstr(3.0) #returns "3.0" as a string`}
                ></Example>
            </Accordion>

            <Accordion
                title="The `type()` function"
                sectionId="get-type-function"
                pageId={props.pageId}
                click={(next: string) => {
                    props.onSectionChange(current, next);
                    setCurrent(next);
                }}
                current={current}
            >
                <p>Returns the data type of the variable.</p>
                <Message>
                    <p>
                        Parameters: <Code>type(x)</Code>
                    </p>
                </Message>
                <Example
                    code={`name = "Carl"\ntype(name) #returns str`}
                ></Example>
                <Example code={`age = 59\ntype(age) #returns int`}></Example>
            </Accordion>
        </Fragment>
    );
};
