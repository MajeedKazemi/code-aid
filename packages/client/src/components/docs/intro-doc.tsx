import { Fragment, useState } from "react";

import { Accordion } from "../accordion";
import { Example } from "../doc-example";
import { Code } from "../doc-inline-code";
import { IDocPageProps } from "./types";

export const IntroDoc = (props: IDocPageProps) => {
    const [current, setCurrent] = useState("");

    return (
        <Fragment>
            <h1 className="doc-title">Python Documentations:</h1>

            <p>
                Learn about different parts of Python programming by clicking on
                any of the items in the menu.
            </p>
        </Fragment>
    );
};
