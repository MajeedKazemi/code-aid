import { Fragment, useContext, useState } from "react";

import { AuthContext } from "../context";
import { Button } from "./button";
import { DocButton, IDocButton } from "./doc-button";
import { CommentsDoc } from "./docs/comments-doc";
import { ConditionalsDoc } from "./docs/conditionals-doc";
import { DataTypesDoc } from "./docs/data-types-doc";
import { ErrorsDoc } from "./docs/errors-doc";
import { FunctionsDoc } from "./docs/functions-doc";
import { IndentationsDoc } from "./docs/indentations-doc";
import { InputOutputDoc } from "./docs/input-output-doc";
import { IntroDoc } from "./docs/intro-doc";
import { ListsDoc } from "./docs/lists-doc";
import { LoopsDoc } from "./docs/loops-doc";
import { OperatorsDoc } from "./docs/operators-doc";
import { RandomDoc } from "./docs/random-doc";
import { VariablesDoc } from "./docs/variables-doc";

interface IPropsDocumentation {
    taskId: string;
}

export const Documentation = (props: IPropsDocumentation) => {
    const { context } = useContext(AuthContext);
    const [showModal, setShowModal] = useState(false);
    const [selectedPageId, setSelectedPageId] = useState("intro");
    const [selectedSectionId, setSelectedSectionId] = useState("");

    const handleSectionChange = (prev: string, next: string) => {
        // if (prev !== "") {
        //     log(props.taskId, context?.user?.id, LogType.DocEvent, {
        //         type: DocEventType.CloseSection,
        //         section: prev,
        //     });
        // }

        // if (next !== "") {
        //     log(props.taskId, context?.user?.id, LogType.DocEvent, {
        //         type: DocEventType.OpenSection,
        //         section: next,
        //     });
        // }

        setSelectedSectionId(next);
    };

    const getContentFromId = (pageId: string) => {
        switch (pageId) {
            case "input-and-output":
                return (
                    <InputOutputDoc
                        pageId={pageId}
                        onSectionChange={handleSectionChange}
                    />
                );

            case "variables":
                return (
                    <VariablesDoc
                        pageId={pageId}
                        onSectionChange={handleSectionChange}
                    />
                );

            case "data-types":
                return (
                    <DataTypesDoc
                        pageId={pageId}
                        onSectionChange={handleSectionChange}
                    />
                );

            case "operators":
                return (
                    <OperatorsDoc
                        pageId={pageId}
                        onSectionChange={handleSectionChange}
                    />
                );

            case "comments":
                return (
                    <CommentsDoc
                        pageId={pageId}
                        onSectionChange={handleSectionChange}
                    />
                );

            case "errors":
                return (
                    <ErrorsDoc
                        pageId={pageId}
                        onSectionChange={handleSectionChange}
                    />
                );

            case "lists":
                return (
                    <ListsDoc
                        pageId={pageId}
                        onSectionChange={handleSectionChange}
                    />
                );

            case "loops":
                return (
                    <LoopsDoc
                        pageId={pageId}
                        onSectionChange={handleSectionChange}
                    />
                );

            case "randoms":
                return (
                    <RandomDoc
                        pageId={pageId}
                        onSectionChange={handleSectionChange}
                    />
                );

            case "conditionals":
                return (
                    <ConditionalsDoc
                        pageId={pageId}
                        onSectionChange={handleSectionChange}
                    />
                );

            case "functions":
                return (
                    <FunctionsDoc
                        pageId={pageId}
                        onSectionChange={handleSectionChange}
                    />
                );

            case "intro":
                return (
                    <IntroDoc
                        pageId={pageId}
                        onSectionChange={handleSectionChange}
                    />
                );

            case "indentations":
                return (
                    <IndentationsDoc
                        pageId={pageId}
                        onSectionChange={handleSectionChange}
                    />
                );
        }
    };

    return (
        <div className="learn-py-container">
            <span className="learn-py-doc-label">Learn about Python:</span>
            <Button
                type="block-big"
                onClick={() => {
                    // log(props.taskId, context?.user?.id, LogType.DocEvent, {
                    //     type: DocEventType.OpenDocModal,
                    // });
                    setShowModal(true);
                }}
            >
                Python Documentation
            </Button>

            <Fragment>
                <div
                    className={`modal-background + ${
                        showModal ? "active" : ""
                    }`}
                    onClick={() => {
                        setShowModal(false);

                        // log(props.taskId, context?.user?.id, LogType.DocEvent, {
                        //     type: DocEventType.CloseDocModal,
                        // });

                        // if (selectedPageId !== "intro") {
                        //     log(
                        //         props.taskId,
                        //         context?.user?.id,
                        //         LogType.DocEvent,
                        //         {
                        //             type: DocEventType.ClosePage,
                        //             page: selectedPageId,
                        //         }
                        //     );
                        // }

                        // if (selectedSectionId !== "") {
                        //     log(
                        //         props.taskId,
                        //         context?.user?.id,
                        //         LogType.DocEvent,
                        //         {
                        //             type: DocEventType.CloseSection,
                        //             section: selectedSectionId,
                        //         }
                        //     );
                        // }
                    }}
                ></div>
                <section
                    className={`doc-container modal-content + ${
                        showModal ? "active" : ""
                    } `}
                >
                    <div className="doc-navigation">
                        {docs.map((doc, index) => (
                            <DocButton
                                selected={selectedPageId === doc.id}
                                key={doc.id}
                                name={doc.name}
                                id={doc.id}
                                onClick={() => {
                                    if (selectedPageId !== "intro") {
                                        // log(
                                        //     props.taskId,
                                        //     context?.user?.id,
                                        //     LogType.DocEvent,
                                        //     {
                                        //         type: DocEventType.ClosePage,
                                        //         page: selectedPageId,
                                        //     }
                                        // );
                                    }

                                    // log(
                                    //     props.taskId,
                                    //     context?.user?.id,
                                    //     LogType.DocEvent,
                                    //     {
                                    //         type: DocEventType.OpenPage,
                                    //         page: doc.id,
                                    //     }
                                    // );

                                    setSelectedPageId(doc.id);
                                }}
                            />
                        ))}
                    </div>
                    <div
                        className="doc-content"
                        onCopy={(e) => {
                            const clipboardText = window
                                .getSelection()
                                ?.toString();

                            if (clipboardText) {
                                // log(
                                //     props.taskId,
                                //     context?.user?.id,
                                //     LogType.DocEvent,
                                //     {
                                //         type: DocEventType.CopyText,
                                //         text: window.getSelection()?.toString(),
                                //     }
                                // );
                            }
                        }}
                    >
                        {getContentFromId(selectedPageId)}
                    </div>
                </section>
            </Fragment>
        </div>
    );
};

const docs: Array<IDocButton> = [
    { id: "input-and-output", name: "Input and Output" },
    { id: "variables", name: "Variables" },
    { id: "data-types", name: "Data Types" },
    { id: "operators", name: "Operators" },
    { id: "comments", name: "Comments" },
    { id: "indentations", name: "Indentations" },
    { id: "conditionals", name: "Conditionals" },
    { id: "loops", name: "Loops" },
    { id: "lists", name: "Lists" },
    { id: "randoms", name: "Randoms" },
    { id: "functions", name: "All Python Functions" },
    { id: "errors", name: "Errors" },
    // { id: "syntax", name: "syntax" },
    // { id: "comments", name: "comments" },
    // { id: "variables", name: "variables" },
    // { id: "variable-names", name: "variable names" },
    // { id: "output-variables", name: "output variables" },
    // { id: "global-variables", name: "global variables" },
    // { id: "data-types", name: "data types" },
    // { id: "numbers", name: "numbers" },
    // { id: "random", name: "random" },
    // { id: "casting", name: "casting" },
    // { id: "strings-concatenation", name: "strings concatenation" },
    // { id: "strings", name: "strings" },
    // { id: "operators", name: "operators" },
    // { id: "booleans", name: "booleans" },
    // { id: "lists", name: "lists" },
    // { id: "list-add-item", name: "list add item" },
    // { id: "list-remove-item", name: "list remove item" },
    // { id: "list-loop-through", name: "list loop through" },
    // { id: "list-operations", name: "list operations" },
    // { id: "if-else", name: "if-else" },
    // { id: "while-loops", name: "while loops" },
    // { id: "for-loops", name: "for loops" },
    // { id: "user-input", name: "user input" },
];
