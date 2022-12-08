import { Fragment, useState } from "react";

import { Accordion } from "../accordion";
import { Example } from "../doc-example";
import { Code } from "../doc-inline-code";
import { Message } from "../doc-message";
import { IDocPageProps } from "./types";

export const ForLoopDoc = (props: IDocPageProps) => {
    const [current, setCurrent] = useState("");

    return (
        <Fragment>
            <h1 className="doc-title">For Loops:</h1>

            <Accordion
                title="For Loops"
                sectionId="for-loops"
                pageId={props.pageId}
                click={(next: string) => {
                    props.onSectionChange(current, next);
                    setCurrent(next);
                }}
                current={current}
            >
                <p>
                    A <Code>for</Code> loop is used for iterating over a
                    sequence (that is either a list, a tuple, a dictionary, a
                    set, or a string).
                </p>
                <p>
                    This is less like the <Code>for</Code> keyword in other
                    programming languages, and works more like an iterator
                    method as found in other object-orientated programming
                    languages.
                </p>
                <p>
                    With the <Code>for</Code> loop we can execute a set of
                    statements, once for each item in a list, tuple, set etc.
                </p>
                <Example
                    code={
                        'fruits = ["apple", "banana", "cherry"]\nfor x in fruits:\n\tprint(x)'
                    }
                    text="Print each fruit in a fruit list:"
                ></Example>
                <p>
                    The <Code>for</Code> loop does not require an indexing
                    variable to set beforehand.
                </p>
            </Accordion>

            <Accordion
                title="Looping Through a String"
                sectionId="looping-through-string"
                pageId={props.pageId}
                click={(next: string) => {
                    props.onSectionChange(current, next);
                    setCurrent(next);
                }}
                current={current}
            >
                <p>
                    Even strings are iterable objects, they contain a sequence
                    of characters:
                </p>
                <Example
                    code={'for x in "banana":\n\tprint(x)'}
                    text='Loop through the letters in the word "banana":'
                ></Example>
            </Accordion>

            <Accordion
                title="The break Statement"
                sectionId="break-statement"
                pageId={props.pageId}
                click={(next: string) => {
                    props.onSectionChange(current, next);
                    setCurrent(next);
                }}
                current={current}
            >
                <p>
                    With the break statement we can stop the loop before it has
                    looped through all the items:
                </p>
                <Example
                    code={
                        'fruits = ["apple", "banana", "cherry"]\nfor x in fruits:\n\tprint(x)\n\tif x == "banana":\n\t\tbreak'
                    }
                    text='Exit the loop when x is "banana":'
                ></Example>
                <Example
                    code={
                        'fruits = ["apple", "banana", "cherry"]\nfor x in fruits:\n\tif x == "banana":\n\t\tbreak\n\tprint(x)'
                    }
                    text='Exit the loop when x is "banana", but this time the break comes before the print:'
                ></Example>
            </Accordion>

            <Accordion
                title="The continue Statement"
                sectionId="continue-statement"
                pageId={props.pageId}
                click={(next: string) => {
                    props.onSectionChange(current, next);
                    setCurrent(next);
                }}
                current={current}
            >
                <p>
                    With the <Code>continue</Code> statement we can stop the
                    current iteration of the loop, and continue with the next:
                </p>
                <Example
                    code={
                        'fruits = ["apple", "banana", "cherry"]\nfor x in fruits:\n\tif x == "banana":\n\tcontinue\n\tprint(x)'
                    }
                    text="Do not print banana:"
                ></Example>
            </Accordion>

            <Accordion
                title="The range() Function"
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
                title="Nested Loops"
                sectionId="nested-loops"
                pageId={props.pageId}
                click={(next: string) => {
                    props.onSectionChange(current, next);
                    setCurrent(next);
                }}
                current={current}
            >
                <p>A nested loop is a loop inside a loop.</p>
                <p>
                    {
                        'The "inner loop" will be executed one time for each iteration of the "outer loop":'
                    }
                </p>
                <Example
                    code={
                        'adj = ["red", "big", "tasty"]\nfruits = ["apple", "banana", "cherry"]\n\nfor x in adj:\n\tfor y in fruits:\n\t\tprint(x, y)'
                    }
                    text=""
                ></Example>
            </Accordion>
        </Fragment>
    );
};
