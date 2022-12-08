import { Fragment, useState } from "react";

import { Accordion } from "../accordion";
import { Example } from "../doc-example";
import { Code } from "../doc-inline-code";
import { Message } from "../doc-message";
import { IDocPageProps } from "./types";

export const RandomDoc = (props: IDocPageProps) => {
    const [current, setCurrent] = useState("");

    return (
        <Fragment>
            <h1 className="doc-title">Random Numbers:</h1>

            <Accordion
                title="Generate random number using `randint()`"
                sectionId="randint-function"
                pageId={props.pageId}
                click={(next: string) => {
                    props.onSectionChange(current, next);
                    setCurrent(next);
                }}
                current={current}
            >
                <p>
                    The <Code>randint()</Code> method returns a randomly
                    generated number from the given range. Needs to be imported
                    from the random module.
                </p>
                <Message>
                    Parameters:{" "}
                    <Code>random.randint(range_start, range_end)</Code>
                </Message>
                <Example
                    code={
                        "import random\n\nprint(random.randint(3, 9)) # prints a random number between 3 and 9"
                    }
                    text="Return a number between 3 and 9 (both included):"
                ></Example>
                <Message>
                    Don't forget to <b>import the random module</b> before using
                    the <Code>randint( )</Code> function. Otherwise, it will
                    throw an error.
                </Message>
            </Accordion>

            <Accordion
                title="Choose randomly from a list using `choice()`"
                sectionId="choice-function"
                pageId={props.pageId}
                click={(next: string) => {
                    props.onSectionChange(current, next);
                    setCurrent(next);
                }}
                current={current}
            >
                <p>
                    The <Code>choice()</Code> method returns a randomly selected
                    element from the specified sequence.
                </p>
                <p>
                    The sequence can be a string, a range, a list, or any other
                    kind of sequence.
                </p>
                <Message>
                    <p>
                        Parameters: <Code>random.choice(list)</Code>
                    </p>
                </Message>
                <Example
                    code={
                        'import random\n\nmylist = ["apple", "banana", "cherry"]\n\nprint(random.choice(mylist)) # prints a random element from the list'
                    }
                    text="Return a random element from a list:"
                ></Example>
            </Accordion>

            <Accordion
                title="Imports"
                sectionId="imports"
                pageId={props.pageId}
                click={(next: string) => {
                    props.onSectionChange(current, next);
                    setCurrent(next);
                }}
                current={current}
            >
                <p>
                    Previously, we dealt with functions and keywords which are
                    included in the Python programming language by default.
                </p>
                <p>
                    However, some functions are not available by default. These
                    supplementary functions can only be used after we tell
                    Python that we are introducing "add-ons". We do so by
                    "importing" an add-on pack - a module.
                </p>
                <Example
                    code={
                        "from random import randint\nfrom random import choice"
                    }
                    text="Imports randint and choice from the random module."
                ></Example>
                <Example
                    code={
                        "from random import randint\nprint(randint(1, 6)) # prints a random number between 1 and 6"
                    }
                    text="Imports randint from the random module and prints a random number between 1 and 6."
                ></Example>
            </Accordion>
        </Fragment>
    );
};
