import React, { useContext, useState } from "react";

import { Button } from "../components/button";
import { Documentation } from "../components/documentation";
import { ExplainCodeComp } from "../components/explain-code-comp";
import { AnswerQuestionComp } from "../components/hint-generator-comp";
import { Layout } from "../components/layout";
import { Login } from "../components/login";
import { Register } from "../components/register";
import { AuthContext } from "../context";

export const HomePage = () => {
    const { context } = useContext(AuthContext);
    const [showRegister, setShowRegister] = useState(false);

    return (
        <Layout>
            {context?.token ? (
                <main className="home-column-container">
                    <div className="home-column">
                        <AnswerQuestionComp />
                    </div>
                    <div className="home-column">
                        <ExplainCodeComp />
                    </div>
                    <div className="home-column">
                        <Documentation />
                    </div>
                </main>
            ) : (
                <div className="container">
                    <main className="card">
                        <div className="card-row">
                            <div className="left">
                                {showRegister ? (
                                    <div className="vertical-space-between">
                                        <Register />
                                        <div>
                                            Already have an account?{" "}
                                            <Button
                                                type="link"
                                                onClick={() => {
                                                    setShowRegister(false);
                                                }}
                                            >
                                                Login
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="vertical-space-between">
                                        <Login />
                                    </div>
                                )}
                            </div>
                            <section className="right">
                                <h2 className="card-title">Coding Q+A</h2>
                                <ul>
                                    <li className="text-md">
                                        Ask C programming questions
                                    </li>
                                    <li className="text-md">
                                        Explain code snippets
                                    </li>
                                    <li className="text-md">
                                        Ask questions about a code snippet
                                    </li>
                                    <li className="text-md">
                                        Hints to fix bugs
                                    </li>
                                    <li className="text-md">
                                        Break down task into steps
                                    </li>
                                </ul>

                                <p className="text-sm">
                                    This tool is part of a research study
                                    conducted by the University of Toronto under
                                    the supervision of professors{" "}
                                    <a href="mailto:mcraig@cs.toronto.edu">
                                        Michelle Craig
                                    </a>
                                    {" and "}
                                    <a href="mailto:tovi@dgp.toronto.edu">
                                        Tovi Grossman
                                    </a>
                                    , and grad student{" "}
                                    <a href="mailto:majeed@dgp.toronto.edu">
                                        Majeed Kazemitabaar
                                    </a>
                                    . If you have any questions or concerns,
                                    please contact us.
                                </p>
                                <br />
                                <p className="text-sm">
                                    Powered by{" "}
                                    <a href="https://openai.com/blog/openai-codex/">
                                        OpenAI Codex
                                    </a>
                                    .
                                </p>
                            </section>
                        </div>
                    </main>
                </div>
            )}
        </Layout>
    );
};
